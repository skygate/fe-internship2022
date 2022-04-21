import React from "react";
import { NFTProductCard } from "components";
import { ExampleNFTList } from "constant/ExampleNFTList";
import styles from "./HotBid.module.scss";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";

export function HotBid() {
    return (
        <div className={styles.hotBidContainer}>
            <div className={styles.headerSection}>
                <span>Hot bid</span>
                <div className={styles.arrowButtons}>
                    <button className={styles.arrowButton}>
                        <img src={arrowLeft} alt="left arrow" />
                    </button>
                    <button className={styles.arrowButton}>
                        <img src={arrowRight} alt="right arrow" />
                    </button>
                </div>
            </div>
            <div className={styles.nftsContainer}>
                {ExampleNFTList.slice(0, 4).map((author) => (
                    <NFTProductCard key={author.authorName} nft={author} />
                ))}
            </div>
        </div>
    );
}
