import API from "./api.js";

export const uploadDocument = async (formData) => {
  const response = await API.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const askDocument = async (question) => {
  const response = await API.post("/documents/ask", {
    question,
  });

  return response.data;
};