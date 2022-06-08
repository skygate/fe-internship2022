import axiosInstance from "services/axios";

interface AuctionData {
    price: number;
    amount: number;
    endDate: string;
}

export const editAuction = (auctionID: string, data: AuctionData) => {
    return axiosInstance.patch(`/auctions/${auctionID}`, data);
};
