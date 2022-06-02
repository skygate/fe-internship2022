import { AuctionItem } from "interfaces";
import styles from "./productCard.module.scss";
import { GreenETHValue } from "components/greenETHValue/GreenETHValue";
import { ProfilePicture } from "..";
import Heart from "assets/Heart.svg";
import { Link } from "react-router-dom";

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

    const highestBid = item.bidHistory.slice(-1)[0]?.bid;

    return (
        <Link to={`/auction/${item._id}`}>
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
                                {item.instantSellPrice === true && (
                                    <button type="button" className={styles.placeBidButton}>
                                        <span>Buy now!</span>
                                    </button>
                                )}
                                {item.putOnSale === true && (
                                    <button type="button" className={styles.placeBidButton}>
                                        <span>Place a bid</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.titleAndPrice}>
                    <span className={styles.nftTitle}>{item.productID.productName}</span>
                    {item.instantSellPrice && (
                        <span className={styles.nftPrice}>
                            <GreenETHValue ETHValue={item.price} />
                        </span>
                    )}
                </div>
                <div className={styles.avatarsAndUnits}>
                    <div className={styles.avatars}>
                        {item.bidHistory.slice(-3).map((item, index) => {
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
                    {highestBid ? (
                        <span className={styles.highestBid}>
                            Highest bid
                            <span className={styles.highestBidValue}>{highestBid?.offer} ETH</span>
                        </span>
                    ) : null}

                    {isHotBid() ? <span className={styles.newBid}>new bid 🔥</span> : null}
                </div>
            </div>
        </Link>
    );
};
