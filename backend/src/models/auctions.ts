import mongoose from "mongoose";

const auctionsSchema = new mongoose.Schema({
    profileID: String,
    productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Products" },
    price: Number,
    amount: Number,
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
                date: Date,
            },
        },
    ],
    startDate: Date,
    endDate: Date,
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
