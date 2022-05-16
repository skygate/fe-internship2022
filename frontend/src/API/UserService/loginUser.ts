import axiosInstance from "services/axios";

export const loginUser = async (data: {}) => {
    try {
        const response = axiosInstance.post("/user/login", JSON.stringify(data));
        return response;
    } catch (error) {
        throw new Error("Couldn't log user");
    }
};
