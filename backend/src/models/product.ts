import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productID: String,
    ownerID: String,
    productName: String,
    productDescription: String,
    productImageUrl: String,
    productCategory: String,
});
const product = mongoose.model("Products", productSchema);
export default product;
