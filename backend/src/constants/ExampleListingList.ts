interface Listing {
  listingID: string;
  userID: string;
  productID: string;
  price: number;
  amount: number;
  highestBid: number;
  startDate: Date;
  endDate: Date;
  likes: number;
}

const ExampleListingList = new Array(20).fill("").map((_, index) => ({
  listingID: `listing_num_${index}`,
  userID: `user_${index}`,
  productID: `productId${index}`,
  price: Math.round(
    Math.random() * (Math.floor(5) - Math.ceil(2)) + Math.ceil(2)
  ),
  amount: Math.round(Math.random() * 3),
  highestBid: Math.round(
    Math.random() * (Math.floor(2) - Math.ceil(0)) + Math.ceil(0)
  ),
  startDate: new Date(),
  endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
  likes: Math.round(Math.random() * 200),
}));

export default ExampleListingList;
