import axiosInstance from "services/axios";

export const confirmUser = async (password: string) =>
    await axiosInstance.post(`/user/confirm`, JSON.stringify({ password: password }));
