import axiosInstance from "services/axios";
import { ProfileInterface } from "interfaces";
import { AxiosResponse } from "axios";

export const getProfile = async (profileID: string) => {
    try {
        const response: AxiosResponse<ProfileInterface> = await axiosInstance.get(
            `/profiles/${profileID}`
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
