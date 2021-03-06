import React, { useContext, useEffect, useRef, useState } from "react";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";
import style from "./creatorNetwork.module.scss";
import exampleImage from "assets/exampleImage.png";
import { ErrorToast, Modal, ProfileHorizontal, LoadingToast, UpdateToast } from "components";
import { useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";
import { Link } from "react-router-dom";
import { intervalToDuration } from "date-fns";
import { AddBidModal } from "components/Modal";
import { addBid } from "API/UserService";
import { BidOffer } from "interfaces";
import { SocketContext } from "App";
import { getAuction } from "API/UserService";
import { UserSelector } from "store/user";
import { getAllAuctions } from "API/UserService/auctions";

export const CreatorNetwork = () => {
    const socket = useContext(SocketContext);
    const [allAuctions, setAllAuctions] = useState<AuctionItem[]>();
    const [auction, setAuction] = useState<AuctionItem>();
    const [timeUntillAuctionEnds, setTimeUntillAuctionEnds] = useState<Duration>();
    const [bidModalVisibility, setBidModalVisibility] = useState(false);
    const lastBid = auction?.bidHistory[auction.bidHistory.length - 1]?.bid;
    const user = useAppSelector(UserSelector);
    const auctionID = useRef<string>();
    useEffect(() => {
        getAllAuctions().then((res) => setAllAuctions(res));
    }, []);

    useEffect(() => {
        if (!allAuctions) return;
        const mostLikedAuction = allAuctions
            .filter((item) => item.bidHistory.length > 0)
            .sort((a, b) => b.likes.length - a.likes.length)
            .slice(0, 1);
        if (!mostLikedAuction[0]) return;
        setAuction(mostLikedAuction[0]);
        if (!mostLikedAuction[0]) return;
        auctionID.current = mostLikedAuction[0]._id;
    }, [allAuctions]);

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

    useEffect(() => {
        socket.on("auction-change", () => {
            if (!auctionID.current) return;
            getAuction(auctionID.current).then((res) => setAuction(res.data));
        });
    }, [socket]);

    const openModal = () => {
        if (!user.userID) return ErrorToast("You have to be logged in");
        setBidModalVisibility(true);
    };

    const placeBid = async (data: BidOffer) => {
        if (!user.userID) return ErrorToast("You have to be logged in");
        if (!auction) return;
        const placeBidToast = LoadingToast("Placing bid...");
        if (lastBid && data.offer <= lastBid.offer)
            return UpdateToast(placeBidToast, "Offer has to be higher than last bid", "error");
        if (user.userID === auction?.profileID.userID)
            return UpdateToast(placeBidToast, "You cannot bid your own auction", "error");
        if (data.profileID == lastBid?.profileID._id)
            return UpdateToast(placeBidToast, "You cannot bid twice", "error");
        try {
            await addBid(data, auction?._id);
            UpdateToast(placeBidToast, "Successfully placed bid!", "success");
        } catch (err) {
            UpdateToast(placeBidToast, "Something gone wrong!", "error");
        }
    };

    return (
        <section className={style.creatorNetwork}>
            {auction && (
                <div className={style.sectionContainer}>
                    <div>
                        <img
                            src={auction?.productID.productImageUrl}
                            alt="Creator Network"
                            className={style.mainImage}
                        />
                    </div>
                    {auction && (
                        <div>
                            <h2 className={style.header}>the creator network&#174;</h2>
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
                                {lastBid ? (
                                    <p className={style.ethValue}>{lastBid.offer}$</p>
                                ) : (
                                    <p className={style.noBids}>Currently no bids</p>
                                )}
                                <p className={style.endTime}>Auction ending in</p>
                                <div className={style.countdown}>
                                    <div>
                                        <p className={style.timeValue}>
                                            {timeUntillAuctionEnds?.hours || "0"}
                                        </p>
                                        <p className={style.timeLabel}>Hrs</p>
                                    </div>
                                    <div>
                                        <p className={style.timeValue}>
                                            {timeUntillAuctionEnds?.minutes || "0"}
                                        </p>
                                        <p className={style.timeLabel}>mins</p>
                                    </div>
                                    <div>
                                        <p className={style.timeValue}>
                                            {timeUntillAuctionEnds?.seconds || "0"}
                                        </p>
                                        <p className={style.timeLabel}>secs</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.buttons}>
                                <button className={style.btnBid} onClick={openModal}>
                                    Place a bid
                                </button>
                                <Link to={`auction/${auction._id}`}>
                                    <button className={style.btnView}>View item</button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <Modal
                visible={bidModalVisibility}
                title="Place bid"
                onClose={() => setBidModalVisibility(false)}
            >
                <AddBidModal onPlaceBid={placeBid} onClose={() => setBidModalVisibility(false)} />
            </Modal>
        </section>
    );
};
