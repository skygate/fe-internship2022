import React from "react";
import { NFTItem } from "../types";
import { FC } from "react";
import styles from "./NFTProductCard.module.scss";
import { ProfilePicture } from "..";
import { GreenETHValue } from "../greenETHValue/GreenETHValue";
import Heart from "../../assets/Heart.svg";

interface NFT {
    nft: NFTItem;
}

export const NFTProductCard: FC<NFT> = ({ nft }) => {
    return (
        <div className={styles.productCardContainer}>
            <div className={styles.nftImageWrapper}>
                <img src={nft.NFTS[0].nftUrl} alt={nft.NFTS[0].title} className={styles.nftImage} />
                <div className={styles.imageHoverSection}>
                    <div className={styles.imageHoverContainer}>
                        <div className={styles.purchasingAndIcon}>
                            <span className={styles.purchasing}>PURCHASING !</span>
                            <button type="button" className={styles.iconContainer}>
                                <img src={Heart} className={styles.heartIcon} alt="heart" />
                            </button>
                        </div>
                        <div className={styles.placeBidContainer}>
                            <button type="button" className={styles.placeBidButton}>
                                <span>Place a bid</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.titleAndPrice}>
                <span className={styles.nftTitle}>{nft.NFTS[0].title}</span>
                <span className={styles.nftPrice}>
                    <GreenETHValue ETHValue={nft.NFTS[0].price} />
                </span>
            </div>
            <div className={styles.avatarsAndUnits}>
                <div className={styles.avatars}>
                    <div className={styles.avatar}>
                        <ProfilePicture url={nft.profilePic} width={"24px"} />
                    </div>
                    <div className={styles.avatar}>
                        <ProfilePicture url={nft.profilePic} width={"24px"} />
                    </div>
                    <div className={styles.avatar}>
                        <ProfilePicture url={nft.profilePic} width={"24px"} />
                    </div>
                    {/* replace it with other prop (for example bidding people?) */}
                </div>
                <span className={styles.unitsInStock}>{nft.NFTS.length} in stock</span>
            </div>
            <div className={styles.bidSection}>
                <span className={styles.highestBid}>
                    Highest bid{" "}
                    <span className={styles.highestBidValue}>{nft.NFTS[0].price} ETH</span>
                </span>
                <span className={styles.newBid}>new bid 🔥</span>
            </div>
        </div>
    );
};
export default NFTProductCard;
