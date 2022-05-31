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

export const Auction = () => {
    const profile = useAppSelector((state) => state.profiles.profiles[0]);
    const [auctionData, setAuctionData] = useState<AuctionItem | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>();
    const auctionID = useParams().auctionID || "";

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
            setTimeout(() => {
                setToastMessage(undefined);
            }, 1000);
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
        />
    );
};
