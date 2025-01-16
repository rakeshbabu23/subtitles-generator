import axios from "axios";
import { Words } from "../context/Provider";
const apiUrl = import.meta.env.VITE_API_URL;
export const handleTranscription = async (file: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/transcribe`,
      { fileName: file },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data?.transcribedText;
  } catch (error) {
    alert("Error while transcribing the video:", error?.message);
    console.error("Error while transcribing the video:", error.message);
    return null;
  }
};

export const readTranscribedFile = async (
  fileUrl: string
): Promise<Words[]> => {
  try {
    const response = await axios.get(fileUrl);
    const data = response.data;
    return data.results.items.map((res) => ({
      word: res.alternatives[0]?.content,
      startTime: res.start_time || "",
      endTime: res.end_time || "",
    }));
  } catch (err: unknown) {
    alert("Error while reading transcribed file:", err?.message);
    console.error("Error while reading transcribed file:", err?.message);
    return null;
  }
};
