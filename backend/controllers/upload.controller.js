const uploadService = require("../services/upload.service");
const uploadFile = async (req, res) => {
  try {
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const uplodedFile = await uploadService.uploadFile(uploadedFile);
    res.status(200).json({
      message: "File uploaded successfully",
      uplodedFile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const transcribeFile = async (req, res, next) => {
  try {
    const { fileName } = req.body;
    if (!fileName) {
      return res
        .status(400)
        .json({ message: "File is missing. Please re-upload" });
    }
    const transcribedText = await uploadService.transcribeFile(fileName);
    res
      .status(200)
      .json({ message: "Transcription successful", transcribedText });
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { uploadFile, transcribeFile };
