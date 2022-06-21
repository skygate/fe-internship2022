import mongoose from "mongoose";
const categoriesSchema = new mongoose.Schema({
    categoryName: String,
    id: String,
});
const categories = mongoose.model("Categories", categoriesSchema);
export default categories;
