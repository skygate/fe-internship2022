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
    following: [
        {
            profileID: string;
        }
    ];
    followers: [
        {
            profileID: string;
        }
    ];
    joinDate: Date;
}
