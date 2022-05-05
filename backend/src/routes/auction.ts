import express from "express";
const router = express.Router();
const auction = require("../controller/auction");

router.get("/all", auction.getAllAuctions);
router.get("/all/:id", auction.getAuction);
router.post("/", auction.addAuction);
router.post("/addBid", auction.addBid);
router.patch("/", auction.editAuction);
router.delete("/", auction.deleteAuction);
router.get("/fullInfo", auction.getAllAuctionsWithFullInfo);
router.get("/fullInfo/:id", auction.getAuctionWithFullInfo);

module.exports = router;
