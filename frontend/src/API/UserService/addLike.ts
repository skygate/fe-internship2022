import axiosInstance from "services/axios";

export const addLike = (profileID: string, auctionID: string) => {
    return axiosInstance.post(`/auctions/${auctionID}/like`, {
        profileID: profileID,
    });
};
