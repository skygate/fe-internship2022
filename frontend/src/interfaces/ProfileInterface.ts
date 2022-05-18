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

export interface ChangeActiveProfilePayload {
    profiles: ProfileInterface[];
    isAuto?: boolean;
}

export interface ActiveProfileState {
    status: string;
    activeProfile: ProfileInterface | null;
}
