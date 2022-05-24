import axiosInstance from "services/axios";

export const addProfile = async (data: {}, userID: string) => {
    try {
        const response = axiosInstance.post(`/profiles/${userID}`, JSON.stringify(data));
        return response;
    } catch (error) {
        throw new Error("Adding new profile failed!");
    }
};
