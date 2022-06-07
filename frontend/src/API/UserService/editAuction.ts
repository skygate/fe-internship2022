import axiosInstance from "services/axios";

interface AuctionData {
    price: number;
    amount: number;
    endDate: string;
}

export const editAuction = (auctionID: string, data: AuctionData) => {
    console.log("helper", data.endDate);
    return axiosInstance.patch(`/auctions/${auctionID}`, data);
};
