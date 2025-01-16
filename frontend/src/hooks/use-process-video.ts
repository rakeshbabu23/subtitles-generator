import React, { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { generateSRT } from "../utils/generateSRT";
import { Words } from "../context/Provider";

const useProcessVideo = ({
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
}: {
  loaded: boolean;
  ffmpegRef: React.MutableRefObject<FFmpeg>;
  videoUrl: string;
  subtitles: Words[];
  setProcessedUrl: React.Dispatch<React.SetStateAction<string>>;
  primaryColor: string;
  outlineColor: string;
  fontSize: number;
  fontFamily: string;
  messageRef: React.RefObject<HTMLParagraphElement>;
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  function toFFmpegColor(rgb: string) {
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
    return "&H" + bgr + "&";
  }
  const processVideo = async () => {
    if (!loaded) return;

    try {
      setLoading(true);
      setProgress(0);
      const ffmpeg = ffmpegRef.current;

      const response = await fetch(videoUrl);
      const videoData = await response.arrayBuffer();
      await ffmpeg.writeFile("input.mp4", new Uint8Array(videoData));

      const srtContent = generateSRT(subtitles);
      await ffmpeg.writeFile(
        "subtitles.srt",
        new TextEncoder().encode(srtContent)
      );

      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-preset",
        "ultrafast",
        "-vf",
        `subtitles=subtitles.srt:fontsdir=/tmp:force_style='Fontname=${fontFamily},FontSize=${fontSize},MarginV=30,PrimaryColour=${toFFmpegColor(
          primaryColor
        )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setProcessedUrl(url);

      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("subtitles.srt");
      await ffmpeg.deleteFile("output.mp4");
    } catch (error) {
      console.error("Error processing video:", error);
      if (messageRef.current) {
        messageRef.current.innerText =
          "Error processing video: " + error.message;
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    progress,
    processVideo,
  };
};

export default useProcessVideo;
