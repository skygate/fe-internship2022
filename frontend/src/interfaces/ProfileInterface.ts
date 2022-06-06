export interface ProfileInterface {
    __v?: string;
    _id: string;
    userID?: string;
    profileName: string;
    about?: string;
    profilePicture: string;
    coverPicture?: string;
    websiteUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    following?: string[];
    followers?: string[];
    joinDate?: Date;
    badge?: number;
    totalEthValue?: number;
}

export interface ChangeActiveProfilePayload {
    profiles: ProfileInterface[];
    isAuto?: boolean;
}

export interface ActiveProfileState {
    status: string;
    activeProfile: ProfileInterface | null;
}

export interface ProfileModalProps {
    userID: string;
    isNew: boolean;
    activeProfile?: ProfileInterface | null;
    isVisible: () => void;
}

export enum ProfileInputType {
    About = "about",
    ProfileName = "profileName",
    WebsiteUrl = "websiteUrl",
    FacebookUrl = "facebookUrl",
    InstagramUrl = "instagramUrl",
    TwitterUrl = "twitterUrl",
    ProfilePicture = "profilePicture",
    CoverPicture = "coverPicture",
}

export interface ProfileInput {
    name: ProfileInputType;
    id: string;
    label: string;
    placeholder: string;
    type: string;
}

export interface PageSlice {
    firstItem: number;
    lastItem: number;
}
