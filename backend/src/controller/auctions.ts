import { Request, Response } from "express";
import auctions from "../models/auctions";

interface Like {
    like: {
        profileID: {};
    };
}

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
                    path: "profileID",
                    select: "userID",
                })
                .populate({
                    path: "productID",
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .populate({
                    path: "bidHistory.bid.profileID",
                    select: "profilePicture profileName",
                })
                .populate({
                    path: "likes.like.profileID",
                    select: "about profilePicture profileName",
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
                    path: "profileID",
                    select: "userID",
                })
                .populate({
                    path: "productID",
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .populate({
                    path: "bidHistory.bid.profileID",
                    select: "profilePicture profileName",
                })
                .populate({
                    path: "likes.like.profileID",
                    select: "about profilePicture profileName",
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
                    path: "profileID",
                    select: "userID profileName profilePicture",
                })
                .populate({
                    path: "productID",
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .populate({
                    path: "bidHistory.bid.profileID",
                    select: "about profilePicture profileName",
                })
                .populate({
                    path: "likes.like.profileID",
                    select: "about profilePicture profileName",
                })
                .exec();
            auctionWithInfo !== null
                ? res.status(200).json(auctionWithInfo)
                : res.status(404).json({ message: "error" });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    const filterAndSortAuctions = async (params: any) => {
        const sortBy = params.sort ?? "startDate";
        const asc = params.asc ?? "-1";
        const category = !params.category || params.category === "all" ? /.*/g : params.category;
        const time = params.time;
        const date = new Date();
        const priceMin = params.priceMin || 0;
        const priceMax = params.priceMax || 1000;

        const minDate =
            time === "week"
                ? date.getTime() - 7 * 24 * 60 * 60 * 1000
                : time === "month"
                ? date.getTime() - 31 * 24 * 60 * 60 * 1000
                : 0;

        try {
            auctions
                .find({ startDate: { $gt: minDate } })
                .find({ price: { $gt: priceMin } })
                .find({ price: { $lt: priceMax } })
                .sort({ [sortBy]: [asc] })
                .populate({
                    path: "bidHistory.bid.profileID",
                    select: "profilePicture profileName",
                })
                .populate({
                    path: "productID",
                    match: {
                        productCategory: category,
                    },
                    select: "ownerID productDescription productName productImageUrl productCategory",
                })
                .exec((err, auctions) => {
                    const filteredAuctions = auctions.filter((item) => {
                        return item.productID;
                    });
                    !filteredAuctions
                        ? res.status(404).json({ message: "error" })
                        : res.json(filteredAuctions);
                });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    req.query.filter || req.query.sort
        ? filterAndSortAuctions(req.query)
        : req.query.profileID && req.query.full === "true"
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
    const { profileID, productID, amount, price, putOnSale, instantSellPrice } = req.body;
    res.setHeader("Access-Control-Allow-Credentials", "true");
    // Handling authentication on every fetch
    if (req.user === undefined) return res.status(401).json({ message: "Not authenticated" });
    const newAuction = new auctions({
        profileID,
        productID,
        amount,
        price,
        putOnSale,
        instantSellPrice,
        bidHistory: new Array(),
        startDate: new Date(),
        endDate: new Date(new Date().setHours(new Date().getHours() + req.body.duration)),
        likes: [],
    });
    try {
        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

export const addBid = async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({ errorMessage: "Data was not send" });
    const { profileID, offer } = req.body;
    const userID = req.user?.userID._id;

    try {
        const foundAuction = await auctions.findById(req.params.id).populate({
            path: "profileID",
            select: "userID",
        });
        if (!foundAuction) return res.status(400).json({ errorMessage: "Auction not found" });
        if (!profileID) return res.status(400).json({ errorMessage: "ProfileID is empty" });
        if (
            foundAuction.bidHistory.length !== 0 &&
            offer < foundAuction.bidHistory[foundAuction.bidHistory.length - 1].bid.offer
        )
            return res.status(400).json({ errorMessage: "Offer is too low!" });
        if (userID == foundAuction.profileID.userID)
            return res.status(400).json({ errorMessage: "You cannot bid your own auction" });
        if (
            foundAuction.bidHistory.length !== 0 &&
            userID ==
                foundAuction.bidHistory[foundAuction.bidHistory.length - 1].bid.profileID.userID
        )
            return res.status(400).json({ errorMessage: "You cannot bid twice" });

        const newBid = {
            bid: {
                profileID,
                offer,
                date: new Date(),
            },
        };
        foundAuction.bidHistory.push(newBid);
        foundAuction.save();
        return res.status(200).json({ errorMessage: "Succesfully placed a bid" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const editAuction = async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({ errorMessage: "Rosources not found" });
    const { price, amount, endDate } = req.body;
    console.log(req.body.endDate);
    try {
        const foundAuction = await auctions.findById(req.params.id);
        if (price) foundAuction.price = price;
        if (amount) foundAuction.amount = amount;
        if (endDate) foundAuction.endDate = new Date(endDate);
        foundAuction.save();
        res.status(200).json({ errorMessage: "Auction was updated" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
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

export const addRemoveLike = async (req: Request, res: Response) => {
    const { auctionID } = req.params;
    const { profileID } = req.body;

    const checkIfExistingLike = (likesArray: Like[]) => {
        return likesArray.findIndex((item) => item.like.profileID == profileID);
    };

    const newLike = {
        like: {
            profileID,
        },
    };
    try {
        const foundAuction = await auctions.findById(auctionID);
        const isAlreadyLiked = checkIfExistingLike(foundAuction.likes);
        if (isAlreadyLiked > -1) {
            let likes = foundAuction.likes;
            likes = likes.filter((item: Like) => item.like.profileID != profileID);
            foundAuction.likes = likes;
            foundAuction.save();
            return res.status(200).json({ errorMessage: "Succesfully unliked an auction" });
        }
        foundAuction.likes.push(newLike);
        foundAuction.save();
        return res.status(200).json({ errorMessage: "Succesfully liked an auction" });
    } catch (error) {
        return res.status(400).json({ errorMessage: "Something gone wrong" });
    }
};
