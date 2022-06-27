import mongoose from "mongoose";

const actionsSchema = new mongoose.Schema({
    profileID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profiles",
    },
    date: String,
    verb: String,
    offer: Number,
    objectID: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "objectModel" },
    objectModel: {
        type: String,
        required: true,
        enum: ["Auctions", "Profiles", "Products"],
    },
});
const auctions = mongoose.model("Actions", actionsSchema);
export default auctions;
