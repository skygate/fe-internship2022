import leftArrow from "assets/arrowLeft.svg";
import rightArrow from "assets/arrowRight.svg";
import { useState } from "react";
import { PageSlice } from "interfaces/ProfileInterface";
import styles from "./ProfileAuctions.module.scss";
import { FC } from "react";
import { ProductCard } from "components";
import { AuctionItem } from "interfaces";

interface AuctionsList {
    usersAuctions: AuctionItem[];
}

export const ProfileAuctions: FC<AuctionsList> = ({ usersAuctions }) => {
    const [createdPageNumber, setCreatedPageNumber] = useState<PageSlice>({
        firstItem: 0,
        lastItem: 3,
    });
    return (
        <div className={styles.createdListt}>
            {usersAuctions.length > 0 ? (
                <div className={styles.createdList}>
                    <div className={styles.itemsBox}>
                        {usersAuctions &&
                            usersAuctions
                                .slice(createdPageNumber.firstItem, createdPageNumber.lastItem)
                                .map((auction, index) => (
                                    <div className={styles.auctionWrapper}>
                                        <div className={styles.productCard}>
                                            <ProductCard key={index} item={auction} />
                                        </div>
                                    </div>
                                ))}
                    </div>
                    <div className={styles.arrows}>
                        <div>
                            {createdPageNumber.firstItem > 0 ? (
                                <img
                                    src={leftArrow}
                                    alt="arrow left"
                                    className={styles.arrow}
                                    id="prevPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem - 3,
                                            lastItem: createdPageNumber.lastItem - 3,
                                        })
                                    }
                                />
                            ) : (
                                <></>
                            )}{" "}
                        </div>
                        <div>
                            {createdPageNumber.lastItem <= usersAuctions.length ? (
                                <img
                                    src={rightArrow}
                                    alt="arrow right"
                                    className={styles.arrow}
                                    id="nextPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem + 3,
                                            lastItem: createdPageNumber.lastItem + 3,
                                        })
                                    }
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <span className={styles.productsEmptyText}>This user has not any auctions</span>
            )}
        </div>
    );
};
