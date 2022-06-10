import React, { useEffect, useState } from "react";
import homeImage from "assets/homeImage.png";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";
import style from "./creatorNetwork.module.scss";
import exampleImage from "assets/exampleImage.png";
import { ProfileHorizontal } from "components";
import { useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";
import { Link } from "react-router-dom";
import { intervalToDuration } from "date-fns";

export const CreatorNetwork = () => {
    const auctions = useAppSelector((state) => state.auctions.auctions);
    const [auction, setAuction] = useState<AuctionItem>();
    const [timeUntillAuctionEnds, setTimeUntillAuctionEnds] = useState<Duration>();
    useEffect(() => {
        setAuction(auctions[1]);
    }, [auctions]);

    const lastBid = auction?.bidHistory[auction.bidHistory.length - 1]?.bid;

    useEffect(() => {
        if (!auction) return;
        const clockInterval = setInterval(() => {
            const duration = intervalToDuration({
                start: new Date(auction.endDate),
                end: new Date(),
            });
            setTimeUntillAuctionEnds(duration);
        }, 1000);
        return () => clearInterval(clockInterval);
    }, [auction]);

    return (
        <section className={style.creatorNetwork}>
            <div className={style.sectionContainer}>
                <img
                    src={auction?.productID.productImageUrl}
                    alt="Creator Network"
                    className={style.mainImage}
                />
                {auction && (
                    <div>
                        <h2>the creator network&#174;</h2>
                        <div className={style.container}>
                            <ProfileHorizontal
                                upperText={auction.profileID.profileName}
                                bottomText="Creator"
                                imageWidth="50px"
                                imageUrl={auction.profileID.profilePicture}
                                linkTo={`/profile/${auction.profileID._id}`}
                            />
                            <ProfileHorizontal
                                upperText="Instant price"
                                bottomText={`${auction.price}$`}
                                imageWidth="50px"
                                imageUrl={exampleImage}
                            />
                        </div>
                        <div className={style.currentBid}>
                            <p className={style.currentBidTitle}>Current Bid</p>
                            <p className={style.ethValue}>{lastBid?.offer}$</p>
                            <p className={style.endTime}>Auction ending in</p>
                            <div className={style.countdown}>
                                <div>
                                    <p className={style.timeValue}>
                                        {timeUntillAuctionEnds?.hours || "-"}
                                    </p>
                                    <p className={style.timeLabel}>Hrs</p>
                                </div>
                                <div>
                                    <p className={style.timeValue}>
                                        {timeUntillAuctionEnds?.minutes || "-"}
                                    </p>
                                    <p className={style.timeLabel}>mins</p>
                                </div>
                                <div>
                                    <p className={style.timeValue}>
                                        {timeUntillAuctionEnds?.seconds || "-"}
                                    </p>
                                    <p className={style.timeLabel}>secs</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.buttons}>
                            <button className={style.btnBid}>Place a bid</button>
                            <Link to={`auction/${auction._id}`}>
                                <button className={style.btnView}>View item</button>
                            </Link>
                        </div>
                        <div className={style.arrowButtons}>
                            <button className={style.arrowButton}>
                                <img src={arrowLeft} alt="left arrow" />
                            </button>
                            <button className={style.arrowButton}>
                                <img src={arrowRight} alt="right arrow" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
