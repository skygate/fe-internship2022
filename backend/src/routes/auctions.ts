import express from "express";
const router = express.Router();
const auctions = require("../controller/auctions");

router.get("/", auctions.getAllAuctions);
router.post("/", auctions.addAuction);
router.post("/:id/bid", auctions.addBid);
router.post("/:auctionID/like", auctions.addRemoveLike);
router.patch("/:id", auctions.editAuction);
router.delete("/:id", auctions.deleteAuction);

module.exports = router;
