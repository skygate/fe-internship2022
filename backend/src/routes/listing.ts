import express from "express";
const router = express.Router();
const listing = require("../controller/listing");

router.get("/all", listing.getAllListings);
router.get("/all/:id", listing.getListing);
router.get("/fullInfo/", listing.getFullInfoListings);
router.get("/fullInfo/:id", listing.getFullInfoListing);

module.exports = router;
