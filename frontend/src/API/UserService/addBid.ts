import axiosInstance from "services/axios";

interface DataInterface {
    offer: number;
    profileID: string;
}

export const addBid = (data: DataInterface, auctionID: string) => {
    axiosInstance.post(`/auctions/${auctionID}/bid`, data);
};
