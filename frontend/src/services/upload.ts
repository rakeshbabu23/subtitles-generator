import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const handleFileUpload = async (formData: FormData) => {
  const response = await axios.post(`${apiUrl}/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
