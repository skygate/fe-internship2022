import { FC } from "react";
import styles from "./NFTListItem.module.scss";
import { ProfilePicture, GreenETHValue } from "components";
import { AuctionItem, NFTItem } from "interfaces";
import { Link } from "react-router-dom";

interface NFTListItemProps {
    auction: AuctionItem;
}

export const NFTListItem = ({ auction }: NFTListItemProps) => {
    return (
        <Link to={`auction/${auction._id}`}>
            <div className={styles.nftContainer}>
                <div className={styles.pictureWrapper}>
                    <img
                        src={auction.productID.productImageUrl}
                        alt={`${auction.productID.productName} nft`}
                        className={styles.nftImage}
                    />
                </div>
                <div className={styles.bidMenuContainer}>
                    <span className={styles.nftTitle}>{auction.productID.productName}</span>
                    <div className={styles.bidInfo}>
                        <ProfilePicture width="24px" url={auction.profileID.profilePicture} />
                        <GreenETHValue
                            ETHValue={auction.bidHistory[auction.bidHistory.length - 1].bid.offer}
                        />
                    </div>
                    <button className={styles.bidButton}>Place a bid</button>
                </div>
            </div>
        </Link>
    );
};
export default NFTListItem;
