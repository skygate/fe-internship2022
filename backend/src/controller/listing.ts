import { Request, Response } from "express";
import { resourceUsage } from "process";
import ExampleListingList from "../constants/ExampleListingList";
import ExampleUserList from "../constants/ExampleUserList";
import productsArray from "../controller/product";
import { Bid } from "../constants/ExampleListingList";

let listingList = ExampleListingList;

let fullInfoListings = new Array();
function fillFullInfo() {
    fullInfoListings = new Array();
    listingList.map((listing) => {
        const listingItem = productsArray.find(
            (product) => product.productId === listing.productID
        );
        fullInfoListings.push({
            listingID: listing.listingID,
            userID: listing.userID,
            price: listing.price,
            amount: listing.amount,
            bidHistory: listing.bidHistory,
            startDate: listing.startDate,
            endDate: listing.endDate,
            likes: listing.likes,
            productImageUrl: listingItem.productImageUrl,
            productName: listingItem.productName,
            productDescription: listingItem.productDescription,
            productID: listingItem.productId,
        });
    });
}
fillFullInfo();

module.exports.getAllListings = (req: Request, res: Response) => {
    listingList.length > 0
        ? res.json(listingList)
        : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.getListing = (req: Request, res: Response) => {
    const listing = ExampleListingList.find((Listing) => Listing.listingID === req.params.id);
    listing ? res.json(listing) : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.getFullInfoListings = (req: Request, res: Response) => {
    fillFullInfo();
    fullInfoListings.length > 0
        ? res.json(fullInfoListings)
        : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.getFullInfoListing = (req: Request, res: Response) => {
    fillFullInfo();
    const fullInfoListing = fullInfoListings.find((Listing) => Listing.listingID === req.params.id);
    fullInfoListing
        ? res.json(fullInfoListing)
        : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.addListing = (req: Request, res: Response) => {
    if (typeof req.body == undefined) {
        res.status(400).json({ errorMessage: "Request body is undefined" });
    } else {
        if (req.body.userID && req.body.productID && req.body.amount && req.body.duration) {
            const listing = {
                listingID: `listing_num_${Math.random() * 999999999999999}`,
                userID: req.body.userID,
                productID: req.body.productID,
                price: req.body.price,
                amount: req.body.amount,
                bidHistory: new Array(),
                startDate: new Date(),
                endDate: new Date(new Date().setHours(new Date().getHours() + req.body.duration)),
                likes: 0,
            };
            listingList.push(listing);
            fillFullInfo();
            res.status(200).json({ errorMessage: "Successfully added listing" });
        } else {
            res.status(400).json({ errorMessage: "Data has missing properties" });
        }
    }
};

module.exports.deleteListing = (req: Request, res: Response) => {
    if (
        typeof req.body == undefined ||
        !listingList.find((listing) => listing.listingID === req.body.listingID)
    ) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    } else {
        listingList = listingList.filter((listing) => listing.listingID !== req.body.listingID);
        fillFullInfo();
        res.status(200).json({ errorMessage: "Successfully deleted listing" });
    }
};

module.exports.editListing = (req: Request, res: Response) => {
    if (typeof req.body == undefined) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    } else {
        let index = listingList.findIndex((listing) => listing.listingID === req.body.listingID);

        if (index > -1) {
            req.body.price
                ? (listingList[index].price = req.body.price)
                : (listingList[index].price = listingList[index].price);
            req.body.amount
                ? (listingList[index].amount = req.body.amount)
                : (listingList[index].amount = listingList[index].amount);
            req.body.longerDuration
                ? (listingList[index].endDate = new Date(
                      new Date().setHours(
                          listingList[index].endDate.getHours() + req.body.longerDuration
                      )
                  ))
                : (listingList[index].endDate = listingList[index].endDate);
            res.status(200).json({ errorMessage: "Succesfully changed listing" });
        } else {
            res.status(404).json({ errorMessage: "Rosources not found" });
        }
    }
};

module.exports.placeBid = (req: Request, res: Response) => {
    if (typeof req.body == undefined) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    } else {
        let index = listingList.findIndex((listing) => listing.listingID === req.body.listingID);

        if (index > -1) {
            if (
                ((req.body.userID.length > 0 &&
                    req.body.offer >
                        listingList[index].bidHistory[listingList[index].bidHistory.length - 1]
                            .offer) ||
                    listingList[index].bidHistory.length === 0) &&
                req.body.userID !== listingList[index].userID &&
                req.body.userID !==
                    listingList[index].bidHistory[listingList[index].bidHistory.length - 1].userID
            ) {
                listingList[index].bidHistory.push(<Bid>{
                    userID: req.body.userID,
                    bidID: `bid_${Math.random() * 1000000000000000}`,
                    offer: req.body.offer,
                    date: new Date(),
                });
                res.status(200).json({ errorMessage: "Succesfully placed a bid" });
            } else {
                res.status(400).json({ errorMessage: "Something gone wrong" });
            }
        } else {
            res.status(400).json({ errorMessage: "Rosources not found" });
        }
    }
};
