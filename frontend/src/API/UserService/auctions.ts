import { AxiosResponse } from "axios";
import { AuctionItem } from "interfaces";
import axiosInstance from "services/axios";

export const getUsersAuctions = async (profileID: string) => {
    const response: AxiosResponse<AuctionItem[]> = await axiosInstance.get(
        `/auctions/?full=true&profileID=${profileID}`
    );
    return response.data;
};
