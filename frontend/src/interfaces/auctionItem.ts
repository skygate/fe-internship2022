import { Bid } from "interfaces";
import { Like } from "interfaces";
import { ProductItem } from "interfaces";

export interface AuctionItem {
    _id: string;
    profileID: string;
    productID: ProductItem;
    putOnSale: boolean;
    instantSellPrice: boolean;
    price: number;
    amount: number;
    bidHistory: Bid[];
    startDate: string;
    endDate: string;
    likes: Like[];
    __v: number;
}
