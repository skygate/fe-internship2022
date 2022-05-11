import React from "react";
import { FC } from "react";
import { ProfilePicture } from "components";
import styles from "./CreatorsListItem.module.scss";
import { NFTItem } from "interfaces";

interface Creator {
    nft: NFTItem;
}

export const CreatorsListItem: FC<Creator> = ({ nft }) => {
    return (
        <div className={styles.creatorContainer}>
            <ProfilePicture width={"56px"} url={nft.profilePic} />
            <span className={styles.avatarBadge}>{nft.NFTS.length}</span>
            <div className={styles.creatorInfo}>
                <span className={styles.creatorName}>{nft.authorName}</span>
                <span className={styles.creatorNFTSValue}>
                    {nft.NFTS.reduce((sum, current) => sum + current.price, 0)}
                    <span className={styles.ETHText}>ETH</span>
                </span>
            </div>
        </div>
    );
};
export default CreatorsListItem;
