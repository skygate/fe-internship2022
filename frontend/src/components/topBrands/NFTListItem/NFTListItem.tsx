import { FC } from "react";
import styles from "./NFTListItem.module.scss";
import { ProfilePicture, GreenETHValue } from "components";
import { NFTItem } from "components/types";

interface Props {
    nft: NFTItem;
}

export const NFTListItem: FC<Props> = ({ nft }) => {
    return (
        <div className={styles.nftContainer}>
            <div className={styles.pictureWrapper}>
                <img
                    src={nft.NFTS[0].nftUrl}
                    alt={`${nft.NFTS[0].title} nft`}
                    className={styles.nftImage}
                />
            </div>
            <div className={styles.bidMenuContainer}>
                <span className={styles.nftTitle}>{nft.NFTS[0].title}</span>
                <div className={styles.bidInfo}>
                    <ProfilePicture width={"24px"} url={nft.profilePic} />
                    <GreenETHValue ETHValue={nft.NFTS[0].price} />
                    <span className={styles.authorStoreLenght}>1 of {nft.NFTS.length}</span>
                </div>
                <button className={styles.bidButton}>Place a bid</button>
            </div>
        </div>
    );
};
export default NFTListItem;
