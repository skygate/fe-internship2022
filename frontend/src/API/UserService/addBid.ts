import axiosInstance from "services/axios";

interface DataInterface {
    offer: number;
    profileID: string;
}

export const addBid = (data: DataInterface, auctionID: string) => {
    axiosInstance.post(`http://localhost:8000/auctions/${auctionID}/bid`, data);
};
