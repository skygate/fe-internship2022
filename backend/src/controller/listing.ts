import { Request, Response } from "express";
import ExampleListingList from "../constants/ExampleListingList";
import ExampleUserList from "../constants/ExampleUserList";
import productsArray from "../controller/product";

const listingList = ExampleListingList;

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
}
fillFullInfo();

module.exports.getAllListings = (req: Request, res: Response) => {
  ExampleListingList
    ? res.json(ExampleListingList)
    : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.getListing = (req: Request, res: Response) => {
  const listing = ExampleListingList.find(
    (Listing) => Listing.listingID === req.params.id
  );
  listing
    ? res.json(listing)
    : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.getFullInfoListings = (req: Request, res: Response) => {
  fillFullInfo();
  fullInfoListings
    ? res.json(fullInfoListings)
    : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.getFullInfoListing = (req: Request, res: Response) => {
  fillFullInfo();
  const fullInfoListing = fullInfoListings.find(
    (Listing) => Listing.listingID === req.params.id
  );
  fullInfoListing
    ? res.json(fullInfoListing)
    : res.status(400).json({ errorMessage: "Rosources not found" });
};

module.exports.addListing = (req: Request, res: Response) => {
  if (typeof req.body == undefined) {
    res.status(400).json({ errorMessage: "Request body is undefined" });
  } else {
    if (
      req.body.userID &&
      req.body.productID &&
      req.body.amount &&
      req.body.duration
    ) {
      const listing = {
        listingID: `listing_num_${Math.random() * 999999999999999}`,
        userID: req.body.userID,
        productID: req.body.productID,
        price: req.body.price,
        amount: req.body.amount,
        highestBid: 0,
        startDate: new Date(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + req.body.duration)
        ),
        likes: 0,
      };
      listingList.push(listing);
      fillFullInfo();
    } else {
      res.status(400).json({ errorMessage: "Data has missing properties" });
    }
  }
};

module.exports.deleteListing = (req: Request, res: Response) => {
  if (typeof req.body == undefined) {
    res.status(400).json({ errorMessage: "Rosources not found" });
  } else {
    let index = listingList
      .map(function (e) {
        return e.listingID;
      })
      .indexOf(req.body.listingID);

    index > -1
      ? listingList.splice(index, 1)
      : res.status(404).json({ errorMessage: "Rosources not found" });
    fillFullInfo();
  }
};

module.exports.editListing = (req: Request, res: Response) => {
  if (typeof req.body == undefined) {
    res.status(400).json({ errorMessage: "Rosources not found" });
  } else {
    let index = listingList
      .map(function (e) {
        return e.listingID;
      })
      .indexOf(req.body.listingID);

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
    } else {
      res.status(404).json({ errorMessage: "Rosources not found" });
    }
  }
};
