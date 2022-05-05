import mongoose from "mongoose";
const auctionSchema = new mongoose.Schema({
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
const auction = mongoose.model("Auctions", auctionSchema);
export default auction;
