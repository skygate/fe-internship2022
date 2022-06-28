import axiosInstance from "services/axios";

export const getAllActions = async () => {
    const response = await axiosInstance.get(`/actions`);
    return response.data;
};

export const getProfileActions = async (profileID: string) => {
    const response = await axiosInstance.get(`/actions/${profileID}`);
    return response.data;
};

export const getFollowingProfilesActions = async (profileID: string) => {
    const response = await axiosInstance.get(`/actions/following/${profileID}`);
    return response.data;
};
