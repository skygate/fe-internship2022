interface Profile {
    _id: string;
    profilePicture: string;
}

export interface Bid {
    bid: {
        profileID: Profile;
        offer: number;
        date: string;
    };
    _id: string;
}
