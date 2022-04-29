export interface Bid {
    userID: string;
    bidID: string;
    offer: number;
    date: Date;
}

interface Listing {
    listingID: string;
    userID: string;
    productID: string;
    price: number;
    amount: number;
    bidHistory: Bid[];
    highestBid: number;
    startDate: Date;
    endDate: Date;
    likes: number;
}

const ExampleListingList = new Array(20).fill("").map((_, index) => ({
    listingID: `listing_num_${index}`,
    userID: `user_${index}`,
    productID: `productId${index}`,
    price: Math.round(Math.random() * (Math.floor(5) - Math.ceil(2)) + Math.ceil(2)),
    amount: Math.round(Math.random() * 3),
    bidHistory: new Array(5).fill("").map((_, index) => ({
        userID: `user_${index}`,
        bidID: `bid_${index}`,
        offer: Math.round(
            Math.random() * (Math.floor(index) - Math.ceil(index)) + Math.ceil(index) * 2
        ),
        date: new Date(new Date().setMinutes(new Date().getMinutes() + 20 * index)),
    })),
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    likes: Math.round(Math.random() * 200),
}));

export default ExampleListingList;
