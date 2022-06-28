import axiosInstance from "services/axios";

export const getAllActionsForProfile = async (profileID: string) => {
    const response = await axiosInstance.get(`/actions`);
    return response.data;
};
