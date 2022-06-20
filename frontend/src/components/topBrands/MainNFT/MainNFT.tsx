import React from "react";
import styles from "./MainNFT.module.scss";
import { ProfilePicture } from "components";
import GreenETHValue from "components/greenETHValue/GreenETHValue";
import { AuctionItem } from "interfaces";
import { Link } from "react-router-dom";

interface MainNFTProps {
    auction: AuctionItem;
}

export const MainNFT = ({ auction }: MainNFTProps) => {
    return (
        <Link to={`/auction/${auction._id}`}>
            <div className="mainNFT">
                <div className={styles.mainImageWrapper}>
                    <img
                        src={auction.productID.productImageUrl}
                        alt="NFT"
                        className={styles.mainImage}
                    />
                </div>
                <div className={styles.mainBidInfo}>
                    <div className={styles.nftInfo}>
                        <ProfilePicture width={"48px"} url={auction.profileID.profilePicture} />
                        <div className={styles.productInfo}>
                            <span className={styles.NFTTitle}>{auction.productID.productName}</span>
                            <span className={styles.units}>{auction.amount} in stock</span>
                        </div>
                    </div>
                    <div className={styles.currentBid}>
                        <span className={styles.highestBid}>Highest bid</span>
                        <GreenETHValue
                            ETHValue={auction.bidHistory[auction.bidHistory.length - 1].bid.offer}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};
