import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userID: String,
    about: String,
    websiteUrl: String,
    profilePicture: String,
    coverPicture: String,
});

const profile = mongoose.model("Profiles", profileSchema);
export default profile;
