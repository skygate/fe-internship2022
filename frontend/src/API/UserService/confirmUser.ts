import axiosInstance from "services/axios";

export const confirmUser = async (password: string) => {
    const response = await axiosInstance.post(
        `/user/confirm`,
        JSON.stringify({ password: password })
    );
    return response;
};
