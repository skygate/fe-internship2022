import { AxiosResponse } from "axios";
import { AuctionItem } from "interfaces";
import axiosInstance from "services/axios";

interface NewAuction {
    userID: string;
    profileID: string;
    productID: string;
    amount: number;
    price: number;
    duration: number;
}

export const getUsersAuctions = async (profileID: string): Promise<AuctionItem[]> => {
    const response: AxiosResponse<AuctionItem[]> = await axiosInstance.get(
        `/auctions/?full=true&profileID=${profileID}`
    );
    return response.data;
};

export const addAuction = async (item: NewAuction) => {
    const response = await axiosInstance.post(`/auctions`, JSON.stringify(item));
    return response;
};
