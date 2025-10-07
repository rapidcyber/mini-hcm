import { axiosWrapper } from "./axiosWrapper";

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// User Endpoints
export const getUsers = () => axiosWrapper.get("/api/user/all");
export const updateUser = ({ userId, ...userData }) =>
  axiosWrapper.put(`/api/user/${userId}`, userData);

// Admin Endpoints
export const changePassword = (data) =>
  axiosWrapper.patch("/api/user/change-password", data);
export const deleteUser = (userId) =>
  axiosWrapper.delete(`/api/user/${userId}`);
export const deleteAttendance = (id) =>
  axiosWrapper.delete(`/api/attendance/${id}`);

// Attendance Endpoints
export const getAttendance = (id) => axiosWrapper.get(`/api/attendance/${id}`);
export const updateAttendance = ({ id, ...data }) =>
  axiosWrapper.put(`/api/attendance/${id}`, data);
export const addAttendance = (data) =>
  axiosWrapper.post("/api/attendance/mark", data);
export const getMyAttendance = () =>
  axiosWrapper.get('/api/attendance/me/all');
export const getAllAttendance = () =>
  axiosWrapper.get(`/api/attendance/all`);