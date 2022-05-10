import { ProfileInterface } from "./ProfileInterface";
export interface Bid {
    profileID: ProfileInterface["_id"];
    offer: number;
    date: Date;
    _id: string;
}
