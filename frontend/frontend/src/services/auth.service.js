import API from "./api.js";

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);

  return response.data;
};

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/auth/current-user");
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};
