import express from "express";
const router = express.Router();
const listing = require("../controller/listing");

router.get("/all", listing.getAllListings);
router.get("/all/:id", listing.getListing);
router.get("/fullInfo/", listing.getFullInfoListings);
router.get("/fullInfo/:id", listing.getFullInfoListing);
<<<<<<< HEAD
router.post("/", listing.addListing);
router.delete("/", listing.deleteListing);
router.patch("/", listing.editListing);
=======
>>>>>>> 4ac93a034f07ed9ef365bcb1a7babd20fbcfc8fc

module.exports = router;
