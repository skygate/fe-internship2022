import { AuctionView } from "./AuctionView";
import { useAppDispatch, useAppSelector } from "store/store";
import { getAuction } from "store/auction";
import { useEffect, useState } from "react";
import { AuctionItem } from "interfaces";
import { useParams } from "react-router-dom";

export const Auction = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.auction.auction);

    const [auctionData, setAuctionData] = useState<AuctionItem>();
    const id = useParams().auctionID;

    useEffect(() => {
        if (id) {
            dispatch(getAuction(id));
        }
    }, []);

    useEffect(() => {
        setAuctionData(data);
    }, [data]);

    const ethDolarExchange = (eth: number) => {
        const exchangeRate = 1800; //1800 $ / eth
        return eth * exchangeRate;
    };

    return <AuctionView auctionData={auctionData} ethDolarExchange={ethDolarExchange} />;
};
