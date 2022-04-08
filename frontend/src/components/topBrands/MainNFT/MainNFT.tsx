import React from "react";
import styles from "./MainNFT.module.scss";
export function MainNFT() {
    const unitsInStock = 0;
    const nftTitle = "NFT TITLE";
    const highestBidETH = 0;
    const nftImage =
        "https://image.shutterstock.com/z/stock-photo-funny-cat-in-round-sunglasses-close-up-1158137110.jpg";
    return (
        <div className="mainNFT">
            <img
                src={nftImage}
                alt="NFT"
                className={styles.mainImage}
                /*replace it with nft img component*/
            />
            <div className={styles.mainBidInfo}>
                <div className={styles.nftInfo}>
                    <img
                        src="https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg"
                        alt="default avatar"
                        className={styles.profileImage}
                        /*replace it with avatar component*/
                    />
                    <div className={styles.productInfo}>
                        <span className={styles.NFTTitle}>{nftTitle}</span>
                        <span className={styles.units}>{unitsInStock} in stock</span>
                    </div>
                </div>
                <div className={styles.currentBid}>
                    <span className={styles.highestBid}>Highest bid</span>
                    <span className={styles.ETHValue}>{highestBidETH} ETH</span>
                </div>
            </div>
        </div>
    );
}
