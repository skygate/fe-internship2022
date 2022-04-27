import { Request, Response } from "express";
import ExampleListingList from "../constants/ExampleListingList";
import ExampleUserList from "../constants/ExampleUserList";
import productsArray from "../controller/product";

const fullInfoListings = new Array();
ExampleListingList.map((listing) => {
  const listingItem = productsArray.find(
    (product) => product.productId === listing.productID
  );
  fullInfoListings.push({
    listingID: listing.listingID,
    price: listing.price,
    amount: listing.amount,
    highestBid: listing.highestBid,
    startDate: listing.startDate,
    endDate: listing.endDate,
    likes: listing.likes,
    productImageUrl: listingItem.productImageUrl,
    productName: listingItem.productName,
    productDescription: listingItem.productDescription,
    productID: listingItem.productId,
  });
});

module.exports.getAllListings = (req: Request, res: Response) => {
  res.json(ExampleListingList);
};

module.exports.getListing = (req: Request, res: Response) => {
  const listing = ExampleListingList.find(
    (Listing) => Listing.listingID === req.params.id
  );
  listing ? res.json(listing) : res.send("listing doesn`t exist");
};

module.exports.getFullInfoListings = (req: Request, res: Response) => {
  res.json(fullInfoListings);
};

module.exports.getFullInfoListing = (req: Request, res: Response) => {
  const fullInfoListing = fullInfoListings.find(
    (Listing) => Listing.listingID === req.params.id
  );
  fullInfoListing
    ? res.json(fullInfoListing)
    : res.send("listing doesn`t exist");
};
