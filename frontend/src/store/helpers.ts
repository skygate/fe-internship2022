import axiosInstance from "services/axios";

export const postUser = () => {
    return axiosInstance.get("/user/logged").then((data) => data.data.userID);
};
