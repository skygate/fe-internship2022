import React from "react";
import styles from "./TopBrandsView.module.scss";
import { MainNFT } from "../../components";
import { CreatorsList, NFTListItem } from "../../components";
import { ExampleNFTList } from "../../constant/ExampleNFTList";

export function TopBrandsView() {
    return (
        <div className={styles.topBrandsContainer}>
            <span className={styles.headerText}>Top Brands and Creators</span>
            <div className={styles.listsContainer}>
                <MainNFT />
                <div className={styles.nftList}>
                    {ExampleNFTList.slice(0, 3).map((author) => (
                        <NFTListItem key={author.authorName} nft={author} />
                    ))}
                </div>
                <CreatorsList />
            </div>
        </div>
    );
}
