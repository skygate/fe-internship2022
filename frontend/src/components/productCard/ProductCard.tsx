import { AuctionItem } from "interfaces";
import styles from "./productCard.module.scss";
import { GreenETHValue } from "components/greenETHValue/GreenETHValue";
import { ProfilePicture } from "..";
import Heart from "assets/Heart.svg";

interface ProductCardProps {
    item: AuctionItem;
}

const getHours = (miliseconds: number) => {
    return miliseconds / 1000 / 60 / 24;
};

export const ProductCard = ({ item }: ProductCardProps) => {
    const isHotBid = () => {
        const currentDate = Date.now();
        const productStartDate = new Date(item.startDate).getTime();
        const timePassed = currentDate - productStartDate;
        const hoursPassed = getHours(timePassed);

        if (hoursPassed > 24) return false;
        return true;
    };

    const checkIsBidHistory = () => {
        if (item.bidHistory.length === 0) return false;
        return true;
    };

    return (
        <div className={styles.productCardContainer}>
            <div className={styles.nftImageWrapper}>
                <img
                    src={item.productID.productImageUrl}
                    alt={item.productID.productName}
                    className={styles.nftImage}
                />
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
                <span className={styles.nftTitle}>{item.productID.productName}</span>
                <span className={styles.nftPrice}>
                    <GreenETHValue ETHValue={item.price} />
                </span>
            </div>
            <div className={styles.avatarsAndUnits}>
                <div className={styles.avatars}>
                    {checkIsBidHistory() &&
                        item.bidHistory.slice(-3).map((item, index) => {
                            return (
                                <div className={styles.avatar} key={index}>
                                    <ProfilePicture
                                        url={item.bid.profileID.profilePicture}
                                        width={"24px"}
                                    />
                                </div>
                            );
                        })}
                </div>
                <span className={styles.unitsInStock}>{item.amount} in stock</span>
            </div>
            <div className={styles.bidSection}>
                {checkIsBidHistory() &&
                    item.bidHistory.slice(-1).map((item) => {
                        return (
                            <span className={styles.highestBid}>
                                Highest bid
                                <span className={styles.highestBidValue}>{item.bid.offer} ETH</span>
                            </span>
                        );
                    })}
                {isHotBid() ? <span className={styles.newBid}>new bid 🔥</span> : null}
            </div>
        </div>
    );
};
