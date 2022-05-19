import { AuctionItem } from "./auctionItem";

export interface AuctionState {
    status: string;
    auctions: AuctionItem[];
}
