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
    expireAt: Date,
});

auctionsSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const auctions = mongoose.model("Auctions", auctionsSchema);
export default auctions;
