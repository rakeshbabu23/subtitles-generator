const {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} = require("@aws-sdk/client-s3");
const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");
const createError = require("http-errors");
const fs = require("fs");

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const checkTranscriptionStatus = async (jobName) => {
  const command = new GetTranscriptionJobCommand({
    TranscriptionJobName: jobName,
  });

  const response = await transcribeClient.send(command);

  if (response.TranscriptionJob.TranscriptionJobStatus === "IN_PROGRESS") {
    // Ensure recursion result is returned
    return await checkTranscriptionStatus(jobName);
  }

  if (response.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
    try {
      const { outputUrl } = await getTranscriptionStatus(jobName);
      return outputUrl; // Properly return the URL
    } catch (error) {
      throw new Error("Unable to retrieve transcription output");
    }
  }

  console.log(
    "Transcription Status:",
    response.TranscriptionJob.TranscriptionJobStatus
  );

  if (response.TranscriptionJob.FailureReason) {
    throw new Error(response.TranscriptionJob.FailureReason);
  }
};

const startTranscription = async (fileName) => {
  try {
    const jobName = `transcription-${Date.now()}`;

    const transcribeParams = {
      TranscriptionJobName: jobName,
      IdentifyLanguage: true,
      Media: {
        MediaFileUri: "s3://" + process.env.AWS_BUCKET_NAME + "/" + fileName,
      },
      OutputBucketName: process.env.AWS_BUCKET_NAME,
      OutputKey: fileName + ".transcription.json",
    };

    const command = new StartTranscriptionJobCommand(transcribeParams);
    await transcribeClient.send(command);

    // Check transcription job status
    const result = await checkTranscriptionStatus(jobName);
    return result;
  } catch (error) {
    console.error("Transcription Error:", error);
    throw new Error(`Failed to process transcription: ${error.message}`);
  }
};

const getTranscriptionStatus = async (jobName) => {
  try {
    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: jobName,
    });

    const response = await transcribeClient.send(command);
    return {
      status: response.TranscriptionJob.TranscriptionJobStatus,
      outputUrl: response.TranscriptionJob.Transcript?.TranscriptFileUri,
      completedAt: response.TranscriptionJob.CompletionTime,
    };
  } catch (error) {
    console.error("Status Check Error:", error);
    throw createError(
      400,
      "Unable to check transcription status: " + error.message
    );
  }
};

const uploadFileToS3 = async (uploadedFile) => {
  let uploadId = null;
  const fileName = `${Date.now()}-${uploadedFile.originalname}`;

  try {
    const fileStream = fs.createReadStream(uploadedFile.path);
    const fileSize = uploadedFile.size;

    // Minimum part size is 5MB
    const partSize = Math.max(fileSize / 10, 5 * 1024 * 1024);

    // Step 1: Initialize multipart upload
    const createMultipartResponse = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        ContentType: uploadedFile.mimetype,
      })
    );

    uploadId = createMultipartResponse.UploadId;

    // Step 2: Prepare parts for upload
    const parts = [];
    const numberOfParts = Math.ceil(fileSize / partSize);
    const uploadPromises = [];

    // Read file in chunks and upload parts
    for (let i = 0; i < numberOfParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, fileSize);
      const partNumber = i + 1;

      const chunk = fs.createReadStream(uploadedFile.path, {
        start,
        end: end - 1,
      });

      const uploadPartCommand = new UploadPartCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: chunk,
      });

      // Create promise that includes both upload and part tracking
      const uploadPromise = s3Client.send(uploadPartCommand).then((result) => ({
        ETag: result.ETag,
        PartNumber: partNumber,
      }));

      uploadPromises.push(uploadPromise);
    }

    // Step 3: Wait for all parts to upload and collect results
    const uploadResults = await Promise.all(uploadPromises);

    // Sort parts by part number to ensure correct order
    const sortedParts = uploadResults.sort(
      (a, b) => a.PartNumber - b.PartNumber
    );

    // Verify all parts are present
    if (sortedParts.length !== numberOfParts) {
      throw new Error(
        `Expected ${numberOfParts} parts but got ${sortedParts.length}`
      );
    }

    // Step 4: Complete multipart upload
    const completeMultipartResponse = await s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      })
    );

    // Clean up temporary file
    fs.unlinkSync(uploadedFile.path);

    return {
      message: "File uploaded successfully",
      fileName: fileName,
      fileUrl:
        completeMultipartResponse.Location ||
        `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    };
  } catch (error) {
    // Abort multipart upload if it was initiated
    if (uploadId) {
      try {
        await s3Client.send(
          new AbortMultipartUploadCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            UploadId: uploadId,
          })
        );
      } catch (abortError) {
        console.error("Error aborting multipart upload:", abortError);
      }
    }

    // Clean up temporary file in case of error
    if (uploadedFile.path) {
      fs.unlinkSync(uploadedFile.path);
    }

    console.error("S3 Upload Error:", error);
    throw createError(400, "Unable to upload file: " + error.message);
  }
};

module.exports = { uploadFileToS3, startTranscription };
