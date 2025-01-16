const createError = require("http-errors");
const { uploadFileToS3, startTranscription } = require("../utils/s3.util");

const uploadFile = async (uploadedFile) => {
  try {
    const uploadResult = await uploadFileToS3(uploadedFile);
    return uploadResult;
  } catch (error) {
    throw createError(400, "Unable to upload file" + error.message);
  }
};

const transcribeFile = async (fileName) => {
  try {
    const transcribedFileUrl = await startTranscription(fileName);
    return transcribedFileUrl;
  } catch (error) {
    throw createError(400, error.message);
  }
};

module.exports = {
  uploadFile,
  transcribeFile,
};
