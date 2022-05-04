import express from "express";
const router = express.Router();
const listing = require("../controller/listing");

router.get("/all", listing.getAllListings);
router.get("/all/:id", listing.getListing);
router.get("/fullInfo/", listing.getFullInfoListings);
router.get("/fullInfo/:id", listing.getFullInfoListing);
router.post("/", listing.addListing);
router.delete("/", listing.deleteListing);
router.patch("/", listing.editListing);
router.post("/addBid", listing.placeBid);

module.exports = router;
