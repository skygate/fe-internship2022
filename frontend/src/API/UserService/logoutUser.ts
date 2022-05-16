import axiosInstance from "services/axios";

export const logoutUser = async () => {
    try {
        const response = axiosInstance.post("/user/logout");
        return response;
    } catch (error) {
        throw new Error("Logout was not succesfull");
    }
};
