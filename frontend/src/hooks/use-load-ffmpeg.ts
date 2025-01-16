import { useState, useRef, useEffect } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import roboto from "../assets/fonts/Roboto-Regular.ttf";
import robotoBold from "../assets/fonts/Roboto-Bold.ttf";
import poppinsBold from "../assets/fonts/Poppins-Bold.ttf";
import poppinsLight from "../assets/fonts/Poppins-Light.ttf";
import poppinsSemiBold from "../assets/fonts/Poppins-SemiBold.ttf";
import poppinsMedium from "../assets/fonts/Poppins-Medium.ttf";
import poppinsRegular from "../assets/fonts/Poppins-Regular.ttf";
const useLoadFfmpeg = () => {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
    // ffmpeg.on("log", ({ message }) => {
    //   console.log(message);
    // });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto));
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold));
    // await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold));
    // await ffmpeg.writeFile(
    //   "/tmp/Poppins-Bold.ttf",
    //   await fetchFile(poppinsBold)
    // );
    // await ffmpeg.writeFile(
    //   "/tmp/Poppins-Light.ttf",
    //   await fetchFile(poppinsLight)
    // );
    // await ffmpeg.writeFile(
    //   "/tmp/Poppins-Regular.ttf",
    //   await fetchFile(poppinsRegular)
    // );
    // await ffmpeg.writeFile(
    //   "/tmp/Poppins-SemiBold.ttf",
    //   await fetchFile(poppinsSemiBold)
    // );
    // await ffmpeg.writeFile(
    //   "/tmp/Poppins-Medium.ttf",
    //   await fetchFile(poppinsMedium)
    // );
    setLoaded(true);
  };

  useEffect(() => {
    load();
    return () => {
      const ffmpeg = ffmpegRef.current;
      if (ffmpeg.loaded) {
        ffmpeg.terminate();
      }
    };
  }, []);
  return { ffmpegRef, loaded };
};

export default useLoadFfmpeg;
