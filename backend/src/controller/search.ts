import { Request, Response } from "express";
import auctions from "../models/auctions";
import profile from "../models/profile";

interface Result {
    object: string;
    picture: string;
    name: string;
    linkTo: string;
}

module.exports.getSearchResults = async (req: Request, res: Response) => {
    const { searchText } = req.body;
    const results: Result[] = [];

    try {
        const foundProfiles = await profile.find({
            profileName: { $regex: searchText, $options: "i" },
        });

        foundProfiles.forEach((item) =>
            results.push({
                object: "Profile",
                picture: item.profilePicture,
                name: item.profileName,
                linkTo: `/profile/${item._id}`,
            })
        );

        const foundAuctions = await auctions.find().populate({
            path: "productID",
            match: { productName: { $regex: searchText, $options: "i" } },
            select: "productName productImageUrl",
        });

        foundAuctions.forEach((item) => {
            if (!item.productID) return;
            results.push({
                object: "Auction",
                picture: item.productID.productImageUrl,
                name: item.productID.productName,
                linkTo: `/auction/${item._id}`,
            });
        });

        res.status(200).json(results);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
