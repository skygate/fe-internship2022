import { AuctionView } from "./AuctionView";
import { useAppSelector } from "store/store";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuctionItem } from "interfaces";
import { useParams } from "react-router-dom";
import { getAuction } from "API/UserService";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { addLike } from "API/UserService";
import { Bid } from "interfaces";
import { addBid } from "API/UserService";
import { BidOffer } from "interfaces";
import { ToolsOptions, ToolsItem, ModalsVisibilityState } from "./interfaces";
import { toast } from "react-toastify";
import { SocketContext } from "App";
import style from "./auction.module.scss";

const ethDolarExchange = (eth: number) => {
    const exchangeRate = 1800; //   1800 $ / eth
    return eth * exchangeRate;
};
const onReportSubmit = () => {};

const DEFAULT_MODAL_VISIBILITY: ModalsVisibilityState = {
    placeBid: false,
    purchase: false,
    editAuction: false,
    deleteAuction: false,
};

const DEFAULT_VISIBLE_BIDS = 3;

export const Auction = () => {
    const profile = useAppSelector((state) => state.profiles.profiles[0]);
    const user = useAppSelector((state) => state.user);
    const auctionID = useParams().auctionID || "";
    const [auctionData, setAuctionData] = useState<AuctionItem | null>(null);
    const [isAuctionLiked, setisAuctionLiked] = useState(false);
    const [dropdownVisibility, setdropdownVisibility] = useState(false);
    const [modalsVisibility, setModalsVisibility] = useState(DEFAULT_MODAL_VISIBILITY);
    const [visibleBids, setVisibleBids] = useState(DEFAULT_VISIBLE_BIDS);
    const highestBid: Bid | undefined = auctionData?.bidHistory[auctionData.bidHistory.length - 1];
    const moreOptionsDropDownRef = useRef<HTMLDivElement>(null);
    const socket = useContext(SocketContext);

    const changeModalsVisibility = (modalID?: string) => {
        setdropdownVisibility(false);
        if (!profile)
            return toast.error("You must be logged!", {
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        if (modalID) return setModalsVisibility({ ...modalsVisibility, [modalID]: true });
        setModalsVisibility(DEFAULT_MODAL_VISIBILITY);
    };
    const toolsArray: ToolsItem[] = [
        {
            action: ToolsOptions.EditAuction,
            label: "Edit auction",
            icon: <MdOutlineModeEdit />,
            onClick: changeModalsVisibility,
            visible: "owner",
        },
        {
            action: ToolsOptions.DeleteAuction,
            label: "Delete auction",
            icon: <AiOutlineCloseCircle />,
            onClick: changeModalsVisibility,
            visible: "owner",
        },
        {
            action: ToolsOptions.Report,
            label: "Report",
            icon: <AiOutlineInfoCircle />,
            onClick: onReportSubmit,
            visible: "all",
        },
    ];

    const checkisAuctionLiked = () => {
        if (auctionData && profile)
            return auctionData.likes.find((item) => item.like.profileID._id == profile._id);
    };

    useEffect(() => {
        getAuction(auctionID).then((auctionsResponse) => setAuctionData(auctionsResponse.data));
    }, []);

    useEffect(() => {
        socket.on("auction-change", () =>
            getAuction(auctionID).then((auctionsResponse) => setAuctionData(auctionsResponse.data))
        );
    }, [socket]);

    useEffect(() => {
        checkisAuctionLiked() ? setisAuctionLiked(true) : setisAuctionLiked(false);
    }, [auctionData, profile]);

    useEffect(() => {
        moreOptionsDropDownRef.current &&
            moreOptionsDropDownRef.current.classList.toggle(style.moreOptionsDropDownVisible);
    }, [dropdownVisibility]);

    const onLikeButtonClick = () => {
        if (!profile)
            return toast.error("You must be logged!", {
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        addLike(profile._id, auctionID);
    };

    const onShareButtonClick = () => navigator.clipboard.writeText(window.location.href);

    const onMoreInfoButtonClick = () => setdropdownVisibility((prev) => !prev);

    const placeBid = async (data: BidOffer) => {
        const placeBidToast = toast.loading("Placing bid...");
        if (highestBid && data.offer <= highestBid.bid.offer)
            return toast.update(placeBidToast, {
                render: "Offer has to be higher than last bid",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        if (user.userID === auctionData?.profileID.userID)
            return toast.update(placeBidToast, {
                render: "You cannot bid your own auction",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        if (data.profileID == highestBid?.bid.profileID._id)
            return toast.update(placeBidToast, {
                render: "You cannot bid twice",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });

        await addBid(data, auctionID)
            .then(() =>
                toast.update(placeBidToast, {
                    render: "Successfully placed bid!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2500,
                    closeOnClick: true,
                })
            )
            .catch(() =>
                toast.update(placeBidToast, {
                    render: "Something gone wrong!",
                    type: "error",
                    isLoading: false,
                    autoClose: 2500,
                    closeOnClick: true,
                })
            );
    };

    const showAllBids = () => {
        if (visibleBids == 0) return setVisibleBids(DEFAULT_VISIBLE_BIDS);
        setVisibleBids(0);
    };

    return (
        <AuctionView
            auctionData={auctionData}
            ethDolarExchange={ethDolarExchange}
            onLikeButtonClick={onLikeButtonClick}
            onShareButtonClick={onShareButtonClick}
            isAuctionLiked={isAuctionLiked}
            toolsArray={toolsArray}
            onMoreInfoButtonClick={onMoreInfoButtonClick}
            moreOptionsDropDownRef={moreOptionsDropDownRef}
            modalsVisibility={modalsVisibility}
            changeModalsVisibility={changeModalsVisibility}
            placeBid={placeBid}
            visibleBids={visibleBids}
            showAllBids={showAllBids}
        />
    );
};
