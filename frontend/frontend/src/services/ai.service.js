import API from "./api.js";

export const getThreads = async () => {
  const response = await API.get("/ai/threads");

  return response.data;
};

export const getSingleThread = async (threadId) => {
  const response = await API.get(`/ai/thread/${threadId}`);

  return response.data;
};

export const deleteThread = async (threadId) => {
  const response = await API.delete(`/ai/thread/${threadId}`);

  return response.data;
};
