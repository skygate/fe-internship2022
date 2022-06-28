import { Bid } from "interfaces";
import { Like } from "interfaces";
import { ProductItem } from "interfaces";

export interface AuctionItem {
    _id: string;
    profileID: {
        _id: string;
        userID: string;
        profileName: string;
        profilePicture: string;
        about: string;
    };
    productID: ProductItem;
    putOnSale: boolean;
    instantSellPrice: boolean;
    price: number;
    amount: number;
    bidHistory: Bid[];
    startDate: string;
    endDate: string;
    likes: Like[];
    isActive: boolean;
    __v: number;
}
