import { AuctionItem } from "./auctionItem";

export interface AuctionsState {
    status: string;
    auctions: AuctionItem[];
}
