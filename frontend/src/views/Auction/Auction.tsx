import { AuctionView } from "./AuctionView";
import { useAppDispatch, useAppSelector } from "store/store";
import { getAuction } from "store/auction";
import { useEffect, useState } from "react";
import { AuctionItem } from "interfaces";

export const Auction = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.auction.auction);

    const [auctionData, setAuctionData] = useState<AuctionItem>();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id") || "6284a1cd7d6f7f57abede036";

    // // 6284a1cd7d6f7f57abede036
    useEffect(() => {
        dispatch(getAuction(id));
    }, []);

    useEffect(() => {
        setAuctionData(data);
    }, [data]);

    return <AuctionView auctionData={auctionData} />;
    // return <AuctionView />;
};
