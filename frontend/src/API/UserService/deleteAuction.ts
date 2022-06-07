import axiosInstance from "services/axios";

export const deleteAuction = async (auctionID: string) => {
    return await axiosInstance.delete(`/auctions/${auctionID}`);
};
