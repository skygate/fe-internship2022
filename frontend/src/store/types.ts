export interface UserState {
    userID: string;
    status: string;
}

export interface ProfileInterface {
    __v: string;
    _id: string;
    userID: string;
    profileName: string;
    about: string;
    profilePicture: string;
    coverPicture: string;
    websiteUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    facebookUrl: string;
    following: string[];
    followers: string[];
    joinDate: Date;
}
