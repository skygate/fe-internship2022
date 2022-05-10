import { ProductInterface } from "./ProductInterface";
import { Bid } from "./Bid";
export interface AuctionWithProductInfo {
    profileID: string;
    __v: number;
    _id: string;
    amount: number;
    bidHistory: Bid[];
    startDate: Date;
    endDate: Date;
    likes: number;
    price: number;
    productID: ProductInterface;
}
