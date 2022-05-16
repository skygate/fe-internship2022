import axiosInstance from "services/axios";

export const getProfilesOfUser = (userID: string) => {
    return axiosInstance.get(`/userProfiles/${userID}`).then((data) => data.data);
};
