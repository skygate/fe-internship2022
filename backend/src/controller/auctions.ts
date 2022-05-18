import { Request, Response } from "express";
import auctions from "../models/auctions";

export const getAllAuctions = (req: Request, res: Response) => {
    const defaultAuctions = async () => {
        try {
            const auctionsList = await auctions.find();
            res.status(200).json(auctionsList);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
    const fullInfoAuctions = async () => {
        try {
            const auctionsWithInfo = await auctions
                .find()
                .populate({
                    path: "productID",
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .populate({
                    path: "bidHistory.bid.profileID",
                    select: "profilePicture profileName",
                })
                .exec();
            res.status(200).json(auctionsWithInfo);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    const fullInfoAuctionsOfUser = async () => {
        try {
            const auctionsWithInfo = await auctions
                .find({ profileID: req.query.profileID })
                .populate({
                    path: "productID",
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .exec();
            res.status(200).json(auctionsWithInfo);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    const defaultAuction = async () => {
        try {
            const foundAuction = await auctions.findById(req.query.id).exec();
            foundAuction !== null
                ? res.status(200).json(foundAuction)
                : res.status(400).json({ message: "error" });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    const fullInfoAuction = async () => {
        try {
            const auctionWithInfo = await auctions
                .findById(req.query.id)
                .populate({
                    path: "productID",
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .exec();
            auctionWithInfo !== null
                ? res.status(200).json(auctionWithInfo)
                : res.status(404).json({ message: "error" });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    req.query.profileID && req.query.full === "true"
        ? fullInfoAuctionsOfUser()
        : req.query.id
        ? req.query.full === "true"
            ? fullInfoAuction()
            : defaultAuction()
        : req.query.full === "true"
        ? fullInfoAuctions()
        : defaultAuctions();
};

export const addAuction = async (req: Request, res: Response) => {
    const { profileID, productID, amount, price } = req.body;
    const newAuction = new auctions({
        profileID,
        productID,
        amount,
        price,
        bidHistory: new Array(),
        startDate: new Date(),
        endDate: new Date(new Date().setHours(new Date().getHours() + req.body.duration)),
        likes: 0,
    });
    try {
        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

export const addBid = async (req: Request, res: Response) => {
    if (typeof req.body == undefined)
        return res.status(400).json({ errorMessage: "Rosources not found" });
    const { profileID, offer } = req.body;

    let foundAuction;
    try {
        foundAuction = await auctions.findById(req.params.id).exec();
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
    if (!foundAuction) return res.status(400).json({ errorMessage: "Auction not found" });

    const isProfileIDEmpty = !!req.body.profileID;
    if (!isProfileIDEmpty) return res.status(400).json({ errorMessage: "ProfileID is empty" });
    const isBidsHistoryEmpty = foundAuction.bidHistory.length === 0;
    const isNewOfferHighestThanPrevious = isBidsHistoryEmpty
        ? true
        : req.body.offer > foundAuction.bidHistory[foundAuction.bidHistory.length - 1].bid.offer;
    const isBiddingProfileDifferentThanSeller = req.body.profileID === foundAuction.profileID;
    const isProfileBiddingHimself = isBidsHistoryEmpty
        ? false
        : req.body.profileID ==
          foundAuction.bidHistory[foundAuction.bidHistory.length - 1].bid.profileID;

    const newBid = {
        bid: {
            profileID,
            offer,
            date: new Date(),
        },
    };

    if (
        (isBidsHistoryEmpty || (isNewOfferHighestThanPrevious && !isProfileBiddingHimself)) &&
        !isBiddingProfileDifferentThanSeller
    ) {
        foundAuction.bidHistory.push(newBid);
        foundAuction.save();
        res.status(200).json({ errorMessage: "Succesfully placed a bid" });
    } else {
        res.status(400).json({ errorMessage: "Something gone wrong" });
    }
};

export const editAuction = async (req: Request, res: Response) => {
    if (typeof req.body == undefined) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    } else {
        let foundAuction;
        try {
            foundAuction = await auctions.findById(req.params.id).exec();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }

        if (!!foundAuction) {
            req.body.price
                ? (foundAuction.price = req.body.price)
                : (foundAuction.price = foundAuction.price);
            req.body.amount
                ? (foundAuction.amount = req.body.amount)
                : (foundAuction.amount = foundAuction.amount);
            req.body.longerDuration
                ? (foundAuction.endDate = new Date(
                      new Date().setHours(foundAuction.endDate.getHours() + req.body.longerDuration)
                  ))
                : (foundAuction.endDate = foundAuction.endDate);
            req.body.likes
                ? (foundAuction.likes = req.body.likes)
                : (foundAuction.likes = foundAuction.likes);
            foundAuction.save();
            res.status(200).json({ errorMessage: "Auction was updated" });
        } else {
            res.status(400).json({ errorMessage: "Rosources not found" });
        }
    }
};

export const deleteAuction = async (req: Request, res: Response) => {
    try {
        auctions.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: "Auction was succesfully deleted" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
