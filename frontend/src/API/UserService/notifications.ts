import axiosInstance from "services/axios";

interface Filters {
    sales: boolean;
    purchases: boolean;
    bids: boolean;
    likes: boolean;
    startedAuctions: boolean;
    follows: boolean;
}

export const getAllActions = async (filters: Filters) => {
    const response = await axiosInstance.post(`/actions`, filters);
    return response.data;
};

export const getProfileActions = async (profileID: string, filters: Filters) => {
    const response = await axiosInstance.post(`/actions/${profileID}`, filters);
    return response.data;
};

export const getFollowingProfilesActions = async (profileID: string, filters: Filters) => {
    const response = await axiosInstance.post(`/actions/following/${profileID}`, filters);
    return response.data;
};
