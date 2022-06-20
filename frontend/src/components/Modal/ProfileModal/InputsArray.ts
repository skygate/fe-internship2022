import { ProfileInput, ProfileInputType } from "interfaces";

export const inputsArray: ProfileInput[] = [
    {
        name: ProfileInputType.ProfileName,
        id: "profileName",
        label: "Profile name",
        placeholder: "Profile name",
        type: "text",
    },
    {
        name: ProfileInputType.About,
        id: "about",
        label: "About",
        placeholder: "Tell something about you",
        type: "text",
    },
    {
        name: ProfileInputType.WebsiteUrl,
        id: "websiteUrl",
        label: "Website address",
        placeholder: "Website URL",
        type: "text",
    },
    {
        name: ProfileInputType.FacebookUrl,
        id: "facebookUrl",
        label: "Facebook profile",
        placeholder: "Facebook profile URL",
        type: "text",
    },
    {
        name: ProfileInputType.InstagramUrl,
        id: "instagramUrl",
        label: "Instagram profile",
        placeholder: "Instagram profile URL",
        type: "text",
    },
    {
        name: ProfileInputType.TwitterUrl,
        id: "twitterUrl",
        label: "Twitter profile",
        placeholder: "Twitter profile URL",
        type: "text",
    },
];
