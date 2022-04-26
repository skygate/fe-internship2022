import express from 'express';
const router = express.Router();
const product = require('../controller/product');

router.get('/', product.getAllProducts);

module.exports = router;
