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
