import axiosInstance from "services/axios";

export const editProfile = async (data: {}, profileID: string | undefined) => {
    try {
        const response = axiosInstance.patch(`/profiles/${profileID}`, JSON.stringify(data));
        return response;
    } catch (error) {
        throw new Error("Editing profile failed!");
    }
};
