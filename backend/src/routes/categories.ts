import express from "express";
const router = express.Router();
const categories = require("../controller/categories");

router.post("/", categories.addCategory);
router.get("/", categories.getCategories);
router.delete("/:id", categories.deleteCategory);

module.exports = router;
