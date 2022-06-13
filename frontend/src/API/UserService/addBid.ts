import axiosInstance from "services/axios";

interface DataInterface {
    offer: number;
    profileID: string;
}

export const addBid = async (data: DataInterface, auctionID: string) => {
    return axiosInstance.post(`/auctions/${auctionID}/bid`, data);
};
