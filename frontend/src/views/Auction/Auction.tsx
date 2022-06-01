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

const socket = io("http://localhost:8080");

const ethDolarExchange = (eth: number) => {
    const exchangeRate = 1800; //   1800 $ / eth
    return eth * exchangeRate;
};

enum ToolsOptions {
    EditAuction = "edit auction",
    RemoveFromSale = "remove from sale",
    Report = "report",
}

interface ToolsItem {
    action: ToolsOptions;
    icon: JSX.Element;
}

const toolsArray: ToolsItem[] = [
    { action: ToolsOptions.EditAuction, icon: <MdOutlineModeEdit /> },
    { action: ToolsOptions.RemoveFromSale, icon: <AiOutlineCloseCircle /> },
    { action: ToolsOptions.Report, icon: <AiOutlineInfoCircle /> },
];

interface ModalsVisibilityState {
    placeBid: boolean;
    purchase: boolean;
}

const DEFAULT_MODAL_VISIBILITY: ModalsVisibilityState = {
    placeBid: false,
    purchase: false,
};

const DEFAULT_VISIBLE_BIDS = 3;

export const Auction = () => {
    const profile = useAppSelector((state) => state.profiles.profiles[0]);
    const [auctionData, setAuctionData] = useState<AuctionItem | null>(null);
    const highestBid: Bid | undefined = auctionData?.bidHistory[auctionData.bidHistory.length - 1];
    const [isLiked, setIsLiked] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>();
    const [modalsVisibility, setModalsVisibility] = useState(DEFAULT_MODAL_VISIBILITY);
    const auctionID = useParams().auctionID || "";

    const clearToastMessage = () => {
        setTimeout(() => {
            setToastMessage(undefined);
        }, 1000);
    };

    const checkIsLiked = () => {
        return auctionData && profile
            ? auctionData.likes.findIndex((item) => item.like.profileID._id == profile._id)
            : -1;
    };

    useEffect(() => {
        getAuction(auctionID).then((auctionsResponse) => setAuctionData(auctionsResponse.data));
    }, []);

    useEffect(() => {
        socket.on("auction-change", () => {
            console.log("socket");
            getAuction(auctionID).then((auctionsResponse) => setAuctionData(auctionsResponse.data));
        });
    }, [socket]);

    useEffect(() => {
        const check = checkIsLiked();
        check > -1 ? setIsLiked(true) : setIsLiked(false);
    }, [auctionData, profile]);

    useEffect(() => {
        moreOptionsDropDownRef.current &&
            (isDropdownVisible
                ? (moreOptionsDropDownRef.current.style.opacity = "1")
                : (moreOptionsDropDownRef.current.style.opacity = "0"));
    }, [isDropdownVisible]);

    const onLikeButtonClick = () => {
        if (!profile) {
            setToastMessage("You have to be logged in");
            clearToastMessage();
            return;
        }
        const profileID = profile._id;
        addLike(profileID, auctionID);
        checkIsLiked();
    };

    const onShareButtonClick = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const onMoreInfoButtonClick = () => {
        setIsDropdownVisible((prev) => !prev);
    };

    const moreOptionsDropDownRef = useRef<HTMLDivElement>(null);

    const changeModalsVisibility = (e: React.MouseEvent, modalID?: string) => {
        if (modalID) {
            if (!profile) {
                setToastMessage("You have to be logged in");
                clearToastMessage();
                return;
            }
            setModalsVisibility({ ...modalsVisibility, [modalID]: true });
            return;
        }
        setModalsVisibility(DEFAULT_MODAL_VISIBILITY);
    };

    interface dataInterface {
        offer: number;
        profileID: string;
    }

    const placeBid = (data: dataInterface) => {
        if (highestBid && data.offer <= highestBid.bid.offer) {
            setToastMessage("Offer has to be higher than last bid");
            clearToastMessage();
            return;
        }
        if (data.profileID === auctionData?.profileID) {
            setToastMessage("You cannot bid your own auction");
            clearToastMessage();
            return;
        }
        if (data.profileID == highestBid?.bid.profileID._id) {
            setToastMessage("You cannot bid twice");
            clearToastMessage();
            return;
        }
        addBid(data, auctionID);
    };

    const [visibleBids, setVisibleBids] = useState<number>(DEFAULT_VISIBLE_BIDS);

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
            isLiked={isLiked}
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
