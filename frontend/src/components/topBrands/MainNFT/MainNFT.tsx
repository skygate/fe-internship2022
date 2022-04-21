import React from "react";
import styles from "./MainNFT.module.scss";
import { ProfilePicture } from "components";
import profilePicture from "assets/profilePicture.png";
import GreenETHValue from "components/greenETHValue/GreenETHValue";

export function MainNFT() {
    const unitsInStock = 4;
    const nftTitle = "NFT TITLE";
    const highestBidETH = 100.1;
    const nftImage =
        "https://image.shutterstock.com/z/stock-photo-funny-cat-in-round-sunglasses-close-up-1158137110.jpg";
    return (
        <div className="mainNFT">
            <div className={styles.mainImageWrapper}>
                <img
                    src={nftImage}
                    alt="NFT"
                    className={styles.mainImage}
                    /*replace it with nft img component*/
                />
            </div>
            <div className={styles.mainBidInfo}>
                <div className={styles.nftInfo}>
                    <ProfilePicture width={"48px"} url={profilePicture} />
                    <div className={styles.productInfo}>
                        <span className={styles.NFTTitle}>{nftTitle}</span>
                        <span className={styles.units}>{unitsInStock} in stock</span>
                    </div>
                </div>
                <div className={styles.currentBid}>
                    <span className={styles.highestBid}>Highest bid</span>
                    <GreenETHValue ETHValue={highestBidETH} />
                </div>
            </div>
        </div>
    );
}
