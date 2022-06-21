import React, { useEffect, useState } from "react";
import styles from "./TopBrandsView.module.scss";
import { CreatorsListItem, NFTListItem, MainNFT } from "components";
import arrowRightdark from "assets/arrowRightdark.svg";
import { getAllAuctions } from "API/UserService/auctions";
import { AuctionItem } from "interfaces";
import { HashLink } from "react-router-hash-link";

const AUCTIONS_IN_COLUMN = 3;
const PROFILES_IN_COLUMN = 4;
export function TopBrandsView() {
    const [allAuctions, setAllAuctions] = useState<AuctionItem[]>();
    const [mostLikedAuctions, setMostLikedAuctions] = useState<AuctionItem[]>();
    const [newestAuctions, setNewestAuction] = useState<AuctionItem[]>();
    useEffect(() => {
        getAllAuctions().then((res) => setAllAuctions(res));
    }, []);

    const getSortedAuctions = () => {
        if (!allAuctions) return;
        const auctionSortedByLikes = allAuctions
            .filter((item) => item.bidHistory.length > 0)
            .sort((a, b) => b.likes.length - a.likes.length);

        setMostLikedAuctions(auctionSortedByLikes);
        const auctionsSortedByDate = allAuctions?.sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

        const auctionsSortedByDateAndFiltered: AuctionItem[] = [];

        auctionsSortedByDate.forEach((item) => {
            if (
                !auctionsSortedByDateAndFiltered.find(
                    (el: AuctionItem) => el.profileID._id === item.profileID._id
                )
            )
                return auctionsSortedByDateAndFiltered.push(item);
        });

        setNewestAuction(auctionsSortedByDateAndFiltered);
    };

    useEffect(() => {
        getSortedAuctions();
    }, [allAuctions]);

    return (
        <div className={styles.topBrandsContainer}>
            <span className={styles.headerText}>Top Brands and Creators</span>
            <div className={styles.listsContainer}>
                {mostLikedAuctions && <MainNFT auction={mostLikedAuctions[1]} />}
                <div className={styles.nftList}>
                    {mostLikedAuctions &&
                        mostLikedAuctions
                            .slice(2, AUCTIONS_IN_COLUMN + 2)
                            .map((item) => <NFTListItem key={item._id} auction={item} />)}
                </div>
                <div className={styles.creatorList}>
                    <span className={styles.latestUploadText}>Latest upload from creators🔥</span>
                    {newestAuctions &&
                        newestAuctions
                            .slice(0, PROFILES_IN_COLUMN + 1)
                            .map((item) => (
                                <CreatorsListItem key={item._id} profile={item.profileID} />
                            ))}
                    <HashLink to="/#discover">
                        <button className={styles.discoverButton}>
                            <span className={styles.discoverButtonText}>Discover more</span>
                            <img
                                className={styles.arrowRight}
                                src={arrowRightdark}
                                alt="arrow right"
                            />
                        </button>
                    </HashLink>
                </div>
            </div>
        </div>
    );
}
