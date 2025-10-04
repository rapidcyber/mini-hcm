import { axiosWrapper } from "./axiosWrapper";

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
// export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// User Endpoints
export const getUsers = () => axiosWrapper.get("/api/user/users");
export const updateUser = ({ userId, ...userData }) =>
  axiosWrapper.put(`/api/user/${userId}`, userData);
export const deleteUser = (userId) =>
  axiosWrapper.delete(`/api/user/${userId}`);
