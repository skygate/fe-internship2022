import { AuctionItem } from "./auctionItem";

export interface AuctionStoreState {
    status: string;
    auction: AuctionItem | undefined;
}
