import { AuctionView } from "./AuctionView";
import { useAppDispatch, useAppSelector } from "store/store";
import { getAuction } from "store/auction";
import React, { useEffect, useState } from "react";
import { AuctionItem } from "interfaces";
import { useParams } from "react-router-dom";
import axiosInstance from "services/axios";

const ethDolarExchange = (eth: number) => {
    const exchangeRate = 1800; //   1800 $ / eth
    return eth * exchangeRate;
};

export const Auction = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.auction.auction);
    const profileID = useAppSelector((state) => state.profiles);

    const [auctionData, setAuctionData] = useState<AuctionItem | null>(null);
    const auctionID = useParams().auctionID || "";

    useEffect(() => {
        dispatch(getAuction(auctionID));
    }, []);

    useEffect(() => {
        setAuctionData(data || null);
    }, [data]);

    const onLikeButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        const profileid = profileID.profiles[0]._id;
        const addNewLike = () => {
            return axiosInstance.post(`/auctions/${auctionID}/like`, {
                profileID: profileid,
                add: true,
            });
        };
        addNewLike();
    };

    return (
        <AuctionView
            auctionData={auctionData}
            ethDolarExchange={ethDolarExchange}
            onLikeButtonClick={onLikeButtonClick}
        />
    );
};
