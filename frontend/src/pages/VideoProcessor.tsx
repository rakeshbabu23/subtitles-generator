import React, { useState, useRef, useEffect } from "react";
import {
  Settings,
  Palette,
  Type,
  Download,
  Upload,
  Loader,
} from "lucide-react";
import useLoadFfmpeg from "../hooks/use-load-ffmpeg";
import useProcessVideo from "../hooks/use-process-video";
const fontOptions = [
  { value: "Roboto", label: "Roboto" },
  { value: "Roboto Bold", label: "Roboto Bold" },
];

interface Words {
  word: string;
  startTime: string;
  endTime: string;
}

const VideoProcessor = ({
  videoUrl,
  subtitles,
  processedUrl,
  setProcessedUrl,
}: {
  videoUrl: string;
  subtitles: Words[];
  processedUrl: string;
  setProcessedUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { loaded, ffmpegRef } = useLoadFfmpeg();

  // const [loading, setLoading] = useState(false);
  // const [progress, setProgress] = useState(0);

  const messageRef = useRef<HTMLParagraphElement>(null);

  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(30);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [activeTab, setActiveTab] = useState("font");
  const { loading, progress, processVideo } = useProcessVideo({
    loaded,
    ffmpegRef,
    videoUrl,
    subtitles,
    setProcessedUrl,
    primaryColor,
    outlineColor,
    fontSize,
    fontFamily,
    messageRef,
  });

  // function toFFmpegColor(rgb: string) {
  //   const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
  //   return "&H" + bgr + "&";
  // }

  // const processVideo = async () => {
  //   if (!loaded) return;

  //   try {
  //     setLoading(true);
  //     setProgress(0);
  //     const ffmpeg = ffmpegRef.current;

  //     const response = await fetch(videoUrl);
  //     const videoData = await response.arrayBuffer();
  //     await ffmpeg.writeFile("input.mp4", new Uint8Array(videoData));

  //     const srtContent = generateSRT(subtitles);
  //     await ffmpeg.writeFile(
  //       "subtitles.srt",
  //       new TextEncoder().encode(srtContent)
  //     );

  //     ffmpeg.on("progress", ({ progress }) => {
  //       setProgress(Math.round(progress * 100));
  //     });

  //     await ffmpeg.exec([
  //       "-i",
  //       "input.mp4",
  //       "-preset",
  //       "ultrafast",
  //       "-vf",
  //       `subtitles=subtitles.srt:fontsdir=/tmp:force_style='Fontname=${fontFamily},FontSize=${fontSize},MarginV=30,PrimaryColour=${toFFmpegColor(
  //         primaryColor
  //       )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
  //       "output.mp4",
  //     ]);

  //     const data = await ffmpeg.readFile("output.mp4");
  //     const url = URL.createObjectURL(
  //       new Blob([data.buffer], { type: "video/mp4" })
  //     );
  //     setProcessedUrl(url);

  //     await ffmpeg.deleteFile("input.mp4");
  //     await ffmpeg.deleteFile("subtitles.srt");
  //     await ffmpeg.deleteFile("output.mp4");
  //   } catch (error) {
  //     console.error("Error processing video:", error);
  //     if (messageRef.current) {
  //       messageRef.current.innerText =
  //         "Error processing video: " + error.message;
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    return () => {
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
      }
    };
  }, [processedUrl]);

  return (
    <div className="overflow-auto   bg-gray-800/50 backdrop-blur-sm border border-gray-700 lg:p-6 space-y-6">
      <div className="flex flex-col gap-6">
        {/* Styling Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">
              Subtitle Settings
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-700">
            <button
              className={`pb-2 px-1 ${
                activeTab === "font"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("font")}
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <span>Font</span>
              </div>
            </button>
            <button
              className={`pb-2 px-1 ${
                activeTab === "color"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("color")}
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>Color</span>
              </div>
            </button>
          </div>

          {/* Font Settings */}
          {activeTab === "font" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Font Size</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                  min="12"
                  max="72"
                />
              </div>
            </div>
          )}

          {/* Color Settings */}
          {activeTab === "color" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-8 rounded cursor-pointer"
                  />
                  <span className="text-gray-300 text-sm">{primaryColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Outline Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={outlineColor}
                    onChange={(e) => setOutlineColor(e.target.value)}
                    className="w-12 h-8 rounded cursor-pointer"
                  />
                  <span className="text-gray-300 text-sm">{outlineColor}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Process Button */}
        <button
          onClick={processVideo}
          disabled={loading || !loaded}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {!loaded ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Loading FFmpeg...
            </>
          ) : loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing... {progress}%
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Burn Subtitles into Video
            </>
          )}
        </button>

        {/* Error Message */}
        <p ref={messageRef} className="text-red-500"></p>

        {/* Processed Video */}
        {processedUrl && (
          <div className="space-y-4">
            <div className="aspect-video w-full relative rounded-lg overflow-hidden bg-black">
              <video
                src={processedUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
            <a
              href={processedUrl}
              download="video-with-subtitles.mp4"
              className="text-center w-full inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download Processed Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoProcessor;
