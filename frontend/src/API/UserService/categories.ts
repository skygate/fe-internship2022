import axiosInstance from "services/axios";

export const getAllCategories = async () => {
    const res = await axiosInstance.get("/categories");
    return res.data;
};
