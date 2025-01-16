import { FC, useContext, useEffect, useState } from "react";
import { UploadContext } from "../context/Provider";
import {
  handleTranscription,
  readTranscribedFile,
} from "../services/transcribe";
import { useNavigate } from "react-router-dom";
import {
  Loader,
  Subtitles,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import VideoProcessor from "./VideoProcessor";

interface Words {
  word: string;
  startTime: string;
  endTime: string;
}

const Main: FC = () => {
  const navigate = useNavigate();
  const { uploadedFile, uploadedFileName, setTranscribedFile } =
    useContext(UploadContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcribedFileWords, setTranscribedFileWords] = useState<Words[]>([]);
  const [selectedWord, setSelectedWord] = useState<Words | null>(null);
  const [editWord, setEditWord] = useState<number>(-1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [processedUrl, setProcessedUrl] = useState("");

  const getSubtitles = async (uploadedFileName: string) => {
    try {
      setIsLoading(true);
      setError("");
      const result = await handleTranscription(uploadedFileName);
      setTranscribedFile(result);
      if (result) {
        const res = await readTranscribedFile(result);
        setTranscribedFileWords(res);
      }
    } catch (err) {
      setError("Error generating subtitles. Please try again.");
      console.error("Error transcribing", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!uploadedFileName) {
      navigate("/");
    }
  }, [uploadedFileName, navigate]);

  const formatTime = (timeString: string) => {
    const time = parseFloat(timeString);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div className=" h-[100vh] bg-gradient-to-b from-gray-900 to-gray-800">
      <div className=" flex relative">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed top-4  z-50 md:hidden bg-gray-800 p-2 rounded-lg text-white"
        >
          {showSidebar ? <ChevronLeft /> : <ChevronRight />}
        </button>

        <div
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative w-full max-w-sm lg:max-w-md transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 h-screen bg-gray-800/95 backdrop-blur-lg border-r border-gray-700`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Subtitles className="w-5 h-5 text-blue-500" />
                Transcribed Words
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {transcribedFileWords.length > 0 ? (
                <div className="space-y-2">
                  {transcribedFileWords.map((word, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedWord(word);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700/50 border-transparent border`}
                    >
                      <div
                        className="text-white font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditWord(index);
                        }}
                      >
                        {editWord === index ? (
                          <input
                            type="text"
                            value={word.word}
                            onChange={(e) =>
                              setTranscribedFileWords((words) =>
                                words.map((w, i) =>
                                  i === editWord
                                    ? { ...w, word: e.target.value }
                                    : w
                                )
                              )
                            }
                            className="w-full bg-gray-700/50 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          word.word
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(word.startTime)} -{" "}
                          {formatTime(word.endTime)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-8">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader className="w-6 h-6 animate-spin text-blue-500" />
                      <p>Processing transcription...</p>
                    </div>
                  ) : (
                    <p>
                      No words transcribed yet. Click "Generate Subtitles" to
                      begin.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-[100vh] overflow-auto flex-1 p-4 lg:p-6 w-full">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Video Preview */}
            {!processedUrl && (
              <div className="bg-gray-800/50 rounded-xl p-4 lg:p-6 backdrop-blur-sm border border-gray-700">
                <div className="aspect-video w-full relative rounded-lg overflow-hidden bg-black">
                  {uploadedFile && (
                    <video
                      controls
                      src={uploadedFile}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="mt-6 flex flex-col items-center gap-4">
                  {transcribedFileWords?.length < 1 && (
                    <button
                      onClick={() => getSubtitles(uploadedFileName)}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Generating Subtitles...
                        </>
                      ) : (
                        <>
                          <Subtitles className="w-5 h-5" />
                          Generate Subtitles
                        </>
                      )}
                    </button>
                  )}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            )}

            {/* Video Processor */}
            {uploadedFile && transcribedFileWords.length > 0 && (
              <VideoProcessor
                videoUrl={uploadedFile}
                subtitles={transcribedFileWords}
                processedUrl={processedUrl}
                setProcessedUrl={(url) => setProcessedUrl(url)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
