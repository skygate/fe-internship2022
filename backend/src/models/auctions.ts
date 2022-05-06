import mongoose from "mongoose";
const auctionsSchema = new mongoose.Schema({
    userID: String,
    productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Products" },
    price: Number,
    amount: Number,
    bidHistory: [
        {
            userID: String,
            bidID: String,
            offer: Number,
            date: Date,
        },
    ],
    startDate: Date,
    endDate: Date,
    likes: Number,
});
const auctions = mongoose.model("Auctions", auctionsSchema);
export default auctions;