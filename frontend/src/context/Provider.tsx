import React, { ReactNode, createContext, useState } from "react";

interface UploadContextType {
  uploadedFile: string;
  setUploadedFile: React.Dispatch<React.SetStateAction<string>>;
  uploadedFileName: string;
  setUploadedFileName: React.Dispatch<React.SetStateAction<string>>;
  subtitles: string;
  setSubtitles: React.Dispatch<React.SetStateAction<string>>;
  transcribedFile: string;
  setTranscribedFile: React.Dispatch<React.SetStateAction<string>>;
  transcribedFileWords: Words[];
  setTranscribedFileWords: React.Dispatch<React.SetStateAction<Words[]>>;
}
export interface Words {
  word: string;
  startTime: string;
  endTime: string;
}

const defaultContextValue: UploadContextType = {
  uploadedFile: "",
  setUploadedFile: () => {},
  uploadedFileName: "",
  setUploadedFileName: () => {},
  subtitles: "",
  setSubtitles: () => {},
  transcribedFile: "",
  setTranscribedFile: () => {},
  transcribedFileWords: [
    {
      word: "",
      startTime: "",
      endTime: "",
    },
  ],
  setTranscribedFileWords: () => {},
};

export const UploadContext =
  createContext<UploadContextType>(defaultContextValue);

interface ProviderProps {
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [subtitles, setSubtitles] = useState<string>("");
  const [transcribedFile, setTranscribedFile] = useState<string>("");
  const [transcribedFileWords, setTranscribedFileWords] = useState<Words[]>([
    {
      word: "",
      startTime: "",
      endTime: "",
    },
  ]);
  return (
    <UploadContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        subtitles,
        setSubtitles,
        transcribedFile,
        setTranscribedFile,
        uploadedFileName,
        setUploadedFileName,
        transcribedFileWords,
        setTranscribedFileWords,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export default Provider;
