import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userID: String,
    profileName: String,
    about: String,
    profilePicture: String,
    coverPicture: String,
    websiteUrl: String,
    instagramUrl: String,
    twitterUrl: String,
    facebookUrl: String,
    following: [
        {
            profileID: String,
        },
    ],
    followers: [
        {
            profileID: String,
        },
    ],
    joinDate: Date,
});

const profile = mongoose.model("Profiles", profileSchema);
export default profile;
