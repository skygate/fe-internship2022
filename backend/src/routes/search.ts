import express from "express";
const router = express.Router();

const search = require("../controller/search");

router.post("/", search.getSearchResults);

module.exports = router;
