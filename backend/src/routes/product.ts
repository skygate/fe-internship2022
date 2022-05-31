import express from "express";
const router = express.Router();
const product = require("../controller/product");

router.get("/", product.getAllProducts);
router.get("/:id", product.getProduct);
router.post("/", product.addProduct);
router.delete("/:id", product.deleteProduct);
router.patch("/", product.editProduct);
router.get("/profile/:id", product.getUsersProducts);

module.exports = router;
