export interface ListingItem {
	listingID: string;
	price: number;
	amount: number;
	highestBid: number;
	startDate: Date;
	endDate: Date;
	likes: number;
	productImageUrl: string;
	productName: string;
	productDescription: string;
	productID: string;
}
