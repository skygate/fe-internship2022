import React, { useContext, useEffect, useState } from "react";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";
import style from "./creatorNetwork.module.scss";
import exampleImage from "assets/exampleImage.png";
import { Modal, ProfileHorizontal } from "components";
import { useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";
import { Link } from "react-router-dom";
import { intervalToDuration } from "date-fns";
import { AddBidModal } from "components/Modal";
import { addBid } from "API/UserService";
import { toast } from "react-toastify";
import { BidOffer } from "interfaces";
import { SocketContext } from "App";
import { getAuction } from "API/UserService";

export const CreatorNetwork = () => {
    const socket = useContext(SocketContext);
    const [auction, setAuction] = useState<AuctionItem>();
    const [timeUntillAuctionEnds, setTimeUntillAuctionEnds] = useState<Duration>();
    const [bidModalVisibility, setBidModalVisibility] = useState(false);
    const lastBid = auction?.bidHistory[auction.bidHistory.length - 1]?.bid;
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        getAuction("62a07222a24e1df13264c9d0").then((res) => setAuction(res.data));
    }, []);

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
            if (!auction) return;
            getAuction(auction._id).then((res) => setAuction(res.data));
        });
    }, [socket]);

    const openModal = () => {
        if (!user.userID) return toast.error("You have to be logged in");
        setBidModalVisibility(true);
    };

    const placeBid = async (data: BidOffer) => {
        if (!user.userID) return toast.error("You have to be logged in");
        if (!auction) return;
        const placeBidToast = toast.loading("Placing bid...");
        if (lastBid && data.offer <= lastBid.offer)
            return toast.update(placeBidToast, {
                render: "Offer has to be higher than last bid",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        if (user.userID === auction?.profileID.userID)
            return toast.update(placeBidToast, {
                render: "You cannot bid your own auction",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        if (data.profileID == lastBid?.profileID._id)
            return toast.update(placeBidToast, {
                render: "You cannot bid twice",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        try {
            await addBid(data, auction?._id);
            toast.update(placeBidToast, {
                render: "Successfully placed bid!",
                type: "success",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        } catch (err) {
            toast.update(placeBidToast, {
                render: "Something gone wrong!",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        }
    };

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
