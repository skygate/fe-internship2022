import axiosInstance from "services/axios";

export const uploadFile = async (image: FormData) => {
    try {
        const response = await axiosInstance.post("/upload", image);
        return response;
    } catch (error) {
        throw new Error("File upload failed");
    }
};
