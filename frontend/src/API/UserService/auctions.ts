import { AxiosResponse } from "axios";
import { AuctionItem } from "interfaces";
import axiosInstance from "services/axios";

interface item123 {
    userID: string;
    profileID: string;
    productID: string;
    amount: number;
    price: number;
    duration: number;
}

export const getUsersAuctions = async (profileID: string) => {
    const response: AxiosResponse<AuctionItem[]> = await axiosInstance.get(
        `/auctions/?full=true&profileID=${profileID}`
    );
    return response.data;
};

export const addAuction = async (item: item123) => {
    const response = axiosInstance.post(`/auctions`, JSON.stringify(item));
    return response;
};
