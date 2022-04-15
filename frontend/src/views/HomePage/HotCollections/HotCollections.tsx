import styles from "./HotCollections.module.scss";
import React from "react";
import { ExampleNFTList } from "../../../constant/ExampleNFTList";
import { HotCollectionItem } from "../../../components";

export function HotCollections() {
    return (
        <section className={styles.hotCollections}>
            <div className={styles.hotCollectionsContainer}>
                <span className={styles.headerText}>Hot Collections</span>
                <div className={styles.collectionItemsContainer}>
                    {ExampleNFTList.slice(0, 3).map((author) => (
                        <HotCollectionItem key={author.authorName} nft={author} />
                    ))}
                </div>
            </div>
        </section>
    );
}
