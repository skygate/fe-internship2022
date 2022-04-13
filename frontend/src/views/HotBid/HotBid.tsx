import React from "react";
import { NFTProductCard } from "../../components";
import { ExampleNFTList } from "../../constant/ExampleNFTList";
import styles from "./HotBid.module.scss";

export function HotBid() {
    return (
        <div className={styles.hotBidContainer}>
            <div className={styles.headerSection}>Hot bid</div>
            <div className={styles.nftsContainer}>
                {ExampleNFTList.slice(0, 4).map((author) => (
                    <NFTProductCard key={author.authorName} nft={author} />
                ))}
            </div>
        </div>
    );
}
