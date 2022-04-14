import React from "react";
import { NFTItem } from "../types";
import { FC } from "react";
import styles from "./HotCollectionItem.module.scss";
import { ProfilePicture } from "..";

interface NFT {
    nft: NFTItem;
}

export const HotCollectionItem: FC<NFT> = ({ nft }) => {
    return (
        <div className={styles.hotCollectionItemContainer}>
            <div className={styles.imageWrapper}>
                <img
                    className={styles.collectionImage}
                    src={nft.NFTS[0].nftUrl}
                    alt="collection jpg"
                />
            </div>
            <span className={styles.collectionTitle}>COLLECTION TITLE</span>
            <span className={styles.collectionDescription}>Collection description</span>
            <div className={styles.collectionInfoContainer}>
                <div className={styles.authorInfo}>
                    <ProfilePicture url={nft.profilePic} width={"24px"} />
                    <span className={styles.authorName}>By {nft.authorName}</span>
                </div>
                <span className={styles.collectionLength}>{nft.NFTS.length} ITEMS</span>
            </div>
        </div>
    );
};
export default HotCollectionItem;
