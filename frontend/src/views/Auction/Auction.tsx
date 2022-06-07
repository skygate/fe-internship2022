import { AuctionView } from "./AuctionView";
import { useAppSelector } from "store/store";
import React, { useEffect, useRef, useState } from "react";
import { AuctionItem } from "interfaces";
import { useParams } from "react-router-dom";
import { getAuction } from "API/UserService";
import io from "socket.io-client";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { addLike } from "API/UserService";
import { Bid } from "interfaces";
import { addBid } from "API/UserService";
import { BidOffer } from "interfaces";
import { ToolsOptions, ToolsItem, ModalsVisibilityState } from "./interfaces";

const socket = io("http://localhost:8080");

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
    const [toastMessage, setToastMessage] = useState<string>();
    const [visibleBids, setVisibleBids] = useState(DEFAULT_VISIBLE_BIDS);
    const highestBid: Bid | undefined = auctionData?.bidHistory[auctionData.bidHistory.length - 1];
    const moreOptionsDropDownRef = useRef<HTMLDivElement>(null);

    const changeModalsVisibility = (modalID?: string) => {
        setdropdownVisibility(false);
        if (!profile) return changeToastMessage("You have to be logged in");
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

    const changeToastMessage = (text: string) => {
        setToastMessage(text);
        setTimeout(() => {
            setToastMessage(undefined);
        }, 1000);
    };

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
            (dropdownVisibility
                ? (moreOptionsDropDownRef.current.style.opacity = "1")
                : (moreOptionsDropDownRef.current.style.opacity = "0"));
    }, [dropdownVisibility]);

    const onLikeButtonClick = () => {
        if (!profile) return changeToastMessage("You have to be logged in");
        addLike(profile._id, auctionID);
    };

    const onShareButtonClick = () => navigator.clipboard.writeText(window.location.href);

    const onMoreInfoButtonClick = () => setdropdownVisibility((prev) => !prev);

    const placeBid = (data: BidOffer) => {
        if (highestBid && data.offer <= highestBid.bid.offer)
            return changeToastMessage("Offer has to be higher than last bid");
        if (user.userID === auctionData?.profileID.userID)
            return changeToastMessage("You cannot bid your own auction");
        if (data.profileID == highestBid?.bid.profileID._id)
            return changeToastMessage("You cannot bid twice");
        addBid(data, auctionID);
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
            toastMessage={toastMessage}
            modalsVisibility={modalsVisibility}
            changeModalsVisibility={changeModalsVisibility}
            placeBid={placeBid}
            visibleBids={visibleBids}
            showAllBids={showAllBids}
        />
    );
};
