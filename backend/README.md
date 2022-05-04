TO START: NPM RUN DEV

LISTNIG ENDPOINTS:
router.get("/all", listing.getAllListings); // response: list of all listings
router.get("/all/:id", listing.getListing); // response: listing with exact listingID
router.get("/fullInfo/", listing.getFullInfoListings); // response: list of all listings with info for ProductCard component
router.get("/fullInfo/:id", listing.getFullInfoListing); // respone: listing with info for ProduuctCard component with exact listingID

router.post("/", listing.addListing); //request body: {
userID: id of user who adding listing,
productID: id of listing product,
price: price of product,
amount: amount of product,
duration: duration of auction in HOURS!!! (from moment of adding listing)

PRICE IS NOT REQUIRED. WITHOUT PRICE IT WILL BE ONLY BIDS AUCTION, WITHOUT BUY NOW OPTIONS. REST OF PROPS ARE REQUIRED
}

router.delete("/", listing.deleteListing); //request body: listingID - removes listing with exact listingID

router.patch("/", listing.editListing); // request body:{
price: new price for item
amount: new amount of item
longerDuration: how much longer will be auciont duration ( adding next hours to existing duration, NOT NEW duration )
router.post("/addBid", listing.placeBid); //request body: listingID, userID, offer

YOU MUST NOT ENTER ALL PROPERTIES. IF YOU DON`T ENTER NEW PROP IT WILL NOT CHANGE (stay with previous version)
}
