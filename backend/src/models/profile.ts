import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
            following: {
                profileID: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: "Profiles",
                },
            },
        },
    ],
    followers: [
        {
            follower: {
                profileID: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: "Profiles",
                },
            },
        },
    ],
    joinDate: Date,
});

const profile = mongoose.model("Profiles", profileSchema);
export default profile;
