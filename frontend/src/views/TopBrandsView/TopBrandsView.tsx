import React from "react";
import styles from "./TopBrandsView.module.scss";
import { MainNFT } from "../../components";
import { NFTList } from "../../components";
import { CreatorsList } from "../../components";

export function TopBrandsView() {
    return (
        <div className={styles.topBrandsContainer}>
            <span className={styles.headerText}>Top Brands and Creators</span>
            <div className={styles.listsContainer}>
                <MainNFT />
                <NFTList />
                <CreatorsList />
            </div>
        </div>
    );
}
