import axiosInstance from "services/axios";

export const deleteAuction = async (auctionID: string) => {
    axiosInstance.delete(`/auctions/${auctionID}`);
};
