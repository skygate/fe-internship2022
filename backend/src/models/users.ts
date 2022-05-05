import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const user = mongoose.model("Users", usersSchema);
export default user;
