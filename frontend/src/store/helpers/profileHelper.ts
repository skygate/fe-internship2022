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
    if (localStorageProfile !== "") {
        for (var profile of profiles) {
            if (profile._id === JSON.parse(localStorageProfile)) {
                return profile;
            }
        }
    }
    localStorage.setItem("activeAccount", JSON.stringify(profiles[0]._id));
    return profiles[0];
};
