import axiosInstance from "services/axios";

export const fetchAuctionById = (id: string) => {
    return axiosInstance.get(`/auctions?full=true&id=${id}`);
};
