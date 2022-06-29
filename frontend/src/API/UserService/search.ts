import axiosInstance from "services/axios";

interface Data {
    searchText: string;
}

export const getSearchResults = async (data: Data) => {
    const res = await axiosInstance.post("/search", data);
    return res.data;
};
