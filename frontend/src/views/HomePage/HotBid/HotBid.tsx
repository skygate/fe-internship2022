import styles from "./HotBid.module.scss";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";
import { useAppSelector } from "store/store";
import { ProductCard } from "components";
import { useEffect, useState } from "react";

const AUCTIONS_PER_PAGE = 4;

export function HotBid() {
    const auctions = useAppSelector((state) => state.auctions.auctions);
    const sortedAuctions = [...auctions];
    sortedAuctions.sort((a, b) => {
        return b.bidHistory.length - a.bidHistory.length;
    });
    const LAST_PAGE_INDEX = Math.ceil(auctions.length / AUCTIONS_PER_PAGE) - 1;

    const [activePage, setActivePage] = useState(0);
    const [visibleAuctions, setVisibleAuctions] = useState(sortedAuctions.slice(0, 4));

    const onPageChange = (arg: string) => {
        if (arg === "prev" && activePage === 0) return;
        if (arg === "next" && activePage === LAST_PAGE_INDEX) return;
        if (arg === "prev") setActivePage((page) => page - 1);
        if (arg === "next") setActivePage((page) => page + 1);
    };

    useEffect(() => {
        setVisibleAuctions(sortedAuctions.slice(0, 4));
    }, [auctions]);

    useEffect(() => {
        setVisibleAuctions(
            sortedAuctions.slice(activePage * AUCTIONS_PER_PAGE, activePage + AUCTIONS_PER_PAGE)
        );
    }, [activePage]);

    return (
        <div className={styles.hotBidContainer}>
            <div className={styles.headerSection}>
                <span>Hot bid</span>
                <div className={styles.arrowButtons}>
                    <button
                        className={
                            activePage === 0
                                ? styles.arrowButton
                                : `${styles.arrowButton} ${styles.hoverButton}`
                        }
                        onClick={() => onPageChange("prev")}
                    >
                        <img src={arrowLeft} alt="left arrow" />
                    </button>
                    <button
                        className={
                            activePage === LAST_PAGE_INDEX
                                ? styles.arrowButton
                                : `${styles.arrowButton} ${styles.hoverButton}`
                        }
                        onClick={() => onPageChange("next")}
                    >
                        <img src={arrowRight} alt="right arrow" />
                    </button>
                </div>
            </div>
            <div className={styles.nftsContainer}>
                {visibleAuctions.map((auction) => (
                    <ProductCard key={auction._id} item={auction} />
                ))}
            </div>
        </div>
    );
}
