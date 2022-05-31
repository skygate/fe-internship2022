import axiosInstance from "services/axios";

export const getAuction = async (id: string) => {
    const response = axiosInstance.get(`/auctions?full=true&id=${id}`);
    return response;
};
