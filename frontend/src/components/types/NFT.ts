export interface NFT {
    nftUrl: string;
    price: number;
    title: string;
}

export interface NFTItem {
    authorName: string;
    profilePic: string;
    NFTS: NFT[];
}
