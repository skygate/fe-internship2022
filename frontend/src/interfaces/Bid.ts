import { ProfileInterface } from "interfaces";

export interface Bid {
    bid: {
        profileID: ProfileInterface;
        offer: number;
        date: string;
    };
    _id?: string;
}
