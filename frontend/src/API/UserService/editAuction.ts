import axiosInstance from "services/axios";

interface AuctionData {
    price: number;
    amount: number;
    endDate: string;
}

export const editAuction = async (auctionID: string, data: AuctionData) => {
    axiosInstance.patch(`/auctions/${auctionID}`, data);
};
