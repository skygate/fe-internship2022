import React from "react";
import styles from "./TopBrandsView.module.scss";
import { MainNFT } from "../../components";
import { CreatorsListItem, NFTListItem } from "../../components";
import { ExampleNFTList } from "../../constant/ExampleNFTList";
import arrowRightdark from "../../assets/arrowRightdark.svg";

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
                <div className={styles.creatorList}>
                    <span className={styles.latestUploadText}>Latest upload from creators🔥</span>
                    {ExampleNFTList.slice(0, 4).map((author) => (
                        <CreatorsListItem key={author.authorName} nft={author} />
                    ))}
                    <button className={styles.discoverButton}>
                        <span className={styles.discoverButtonText}>Discover more</span>
                        <img className={styles.arrowRight} src={arrowRightdark} alt="arrow right" />
                    </button>
                </div>
            </div>
        </div>
    );
}
