import axiosInstance from "services/axios";
import { ProfileInterface } from "interfaces";
import { AxiosResponse } from "axios";

export const getProfile = async (profileID: string) => {
    const response: AxiosResponse<ProfileInterface> = await axiosInstance.get(
        `/profiles/${profileID}`
    );
    return response.data;
};

export const deleteProfile = async (profileID: string) => {
    const response: AxiosResponse<ProfileInterface> = await axiosInstance.delete(
        `/profiles/${profileID}`
    );
    return response.data;
};

export const followProfile = async (activeProfileID: string, followingProfileID: string) => {
    const response = await axiosInstance.post(`/profiles/follow/${followingProfileID}`, {
        id: activeProfileID,
    });
    return response.data;
};

export const unfollowProfile = async (activeProfileID: string, followingProfileID: string) => {
    const response = await axiosInstance.post(`/profiles/unfollow/${followingProfileID}`, {
        id: activeProfileID,
    });
    return response.data;
};
