import { useContext, useState, useCallback } from "react";
import { UploadContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import { handleFileUpload } from "../services/upload";
import { Upload, FileVideo } from "lucide-react";
import Loader from "./Loader";

const Hero = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUploadedFile, setUploadedFileName } = useContext(UploadContext);

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await handleFileUpload(formData);
      setIsLoading(false);
      setUploadedFile(result?.uplodedFile?.fileUrl);
      setUploadedFileName(result?.uplodedFile?.fileName);
      navigate("/main");
      setFile("");
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert(err?.response?.message);
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <main className=" rounded-lg h-[auto] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="inline-block animate-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-300% font-extrabold">
                Add Epic Captions
              </span>
              <br />
              <span className="inline-block mt-2">to Your Videos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Just upload your video, and we'll do the magic ✨
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`relative group rounded-2xl p-4 transition-all duration-300 ease-in-out
              ${
                isDragging
                  ? "bg-blue-500/10 border-blue-400/50"
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              } border-2 border-dashed backdrop-blur-sm`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-6">
              <div
                className={`transform transition-transform duration-300 ${
                  isDragging ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Upload size={48} className="text-blue-400" />
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-lg text-gray-300">
                  Drag and drop your video here, or
                </p>
                <label className="inline-block">
                  <span className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform transition-all duration-200 hover:-translate-y-0.5">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                  />
                </label>
              </div>

              {file && (
                <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <FileVideo size={20} />
                  <span className="text-sm">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          {file && (
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out transform
                  bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                  text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                  hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isLoading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && <Loader />}
    </main>
  );
};

export default Hero;
