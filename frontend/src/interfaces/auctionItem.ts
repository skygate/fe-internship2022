export interface AuctionItem {
    _id: string;
    profileID: string;
    productID: {
        _id: string;
        ownerID: string;
        productName: string;
        productDescription: string;
        productImageUrl: string;
        productCategory: string;
    };
    price: number;
    amount: number;
    bidHistory: [
        {
            _id: string;
            profileID: string;
            offer: number;
            date: string;
        }
    ];
    startDate: string;
    endDate: string;
    likes: number;
    __v: number;
}
