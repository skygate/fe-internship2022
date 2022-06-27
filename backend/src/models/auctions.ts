import mongoose from "mongoose";

const auctionsSchema = new mongoose.Schema({
    profileID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profiles",
    },
    productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Products" },
    price: Number,
    amount: Number,
    isActive: Boolean,
    putOnSale: Boolean,
    instantSellPrice: Boolean,
    bidHistory: [
        {
            bid: {
                profileID: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Profiles",
                },
                bidID: String,
                offer: Number,
                date: String,
            },
        },
    ],
    startDate: String,
    endDate: String,
    likes: [
        {
            like: {
                profileID: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Profiles",
                },
            },
        },
    ],
});
const auctions = mongoose.model("Auctions", auctionsSchema);
export default auctions;
