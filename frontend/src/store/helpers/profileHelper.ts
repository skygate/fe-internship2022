import axiosInstance from "services/axios";
import { ProfileInterface } from "interfaces";

export const getProfilesOfUser = (userID: string) => {
    return axiosInstance.get(`/userProfiles/${userID}`).then((data) => data.data);
};

export const setActiveProfile = (profile: ProfileInterface) => {
    localStorage.setItem("activeAccount", JSON.stringify(profile._id));
    return profile;
};

export const setActiveProfileAuto = (profiles: ProfileInterface[]) => {
    const localStorageProfile = localStorage.getItem("activeAccount") || "";
    const profileToSet = localStorageProfile
        ? profiles.find((p) => p._id === JSON.parse(localStorageProfile)) ?? profiles[0]
        : profiles[0];
    return setActiveProfile(profileToSet);
};
