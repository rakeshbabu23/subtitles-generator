import { Words } from "../context/Provider";
export const generateSRT = (subtitles: Words[]) => {
  return subtitles
    .filter(
      (sub) =>
        !isNaN(parseFloat(sub.startTime)) && !isNaN(parseFloat(sub.endTime))
    )
    .map((sub, index) => {
      const startTime = formatTimeToSRT(parseFloat(sub.startTime));
      const endTime = formatTimeToSRT(parseFloat(sub.endTime));
      return `${index + 1}\n${startTime} --> ${endTime}\n${sub.word}`;
    })
    .join("\n\n");
};

const formatTimeToSRT = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds)) return "00:00:00,000";
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(
    3,
    "0"
  )}`;
};
