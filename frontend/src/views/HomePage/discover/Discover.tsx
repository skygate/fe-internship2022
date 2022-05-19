import React, { useEffect, useState } from "react";
import { DiscoverView } from "./DiscoverView";
import { useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";

const PRICE_GAP = 20;
const AUCTIONS_PER_PAGE = 8;
const INITIAL_STYLE = {
    background: `linear-gradient(to right, #E6E8EC 0% , #3772ff 0% , #3772ff 100%, #E6E8EC 100%)`,
};

const PRICE_STATE_DEFAULT = {
    priceRangeMin: 0,
    priceRangeMax: 400,
    priceRangeStyle: INITIAL_STYLE,
};

const calculatePercentage = (nominator: number, denominator: number) =>
    (nominator / denominator) * 100;

export const Discover = () => {
    const auctions = useAppSelector((state) => state.auctions.auctions);
    const [priceState, setPriceState] = useState(PRICE_STATE_DEFAULT);
    const [priceRangeStyle, setPriceRangeStyle] = useState(INITIAL_STYLE);
    const [activeAuctions, setActiveAuctions] = useState<AuctionItem[]>([]);
    const [activePage, setActivePage] = useState(0);

    useEffect(() => {
        const firstPageAuctions = auctions.slice(0, AUCTIONS_PER_PAGE);
        setActiveAuctions(firstPageAuctions);
    }, [auctions]);

    const setPriceRangeBackground = (percent1: number, percent2: number) => {
        setPriceRangeStyle({
            background: `linear-gradient(to right, #E6E8EC ${percent1}% , #3772ff ${percent1}% , #3772ff ${percent2}%, #E6E8EC ${percent2}%)`,
        });
    };

    const fillColor = () => {
        const percent1 = calculatePercentage(
            priceState.priceRangeMin,
            PRICE_STATE_DEFAULT.priceRangeMax
        );
        const percent2 = calculatePercentage(
            priceState.priceRangeMax,
            PRICE_STATE_DEFAULT.priceRangeMax
        );
        setPriceRangeBackground(percent1, percent2);
    };

    const checkGap = (priceMin: number, priceMax: number, gap: number) =>
        priceMax - priceMin >= gap ? true : false;

    const onMinPriceRangeChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        checkGap(priceState.priceRangeMin, priceState.priceRangeMax, PRICE_GAP)
            ? setPriceState({ ...priceState, priceRangeMin: Number(target.value) })
            : setPriceState({ ...priceState, priceRangeMin: priceState.priceRangeMax - PRICE_GAP });
        fillColor();
    };

    const onMaxPriceRangeChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;

        checkGap(priceState.priceRangeMin, priceState.priceRangeMax, PRICE_GAP)
            ? setPriceState({ ...priceState, priceRangeMax: Number(target.value) })
            : setPriceState({ ...priceState, priceRangeMax: priceState.priceRangeMin + PRICE_GAP });

        fillColor();
    };

    const showNextPage = () => {
        const lastPage = Math.ceil(auctions.length / AUCTIONS_PER_PAGE);
        const nextPage = activePage + 1;
        if (nextPage >= lastPage) return;
        setActivePage(activePage + 1);
    };

    const showPrevPage = () => {
        if (activePage === 0) return;
        setActivePage(activePage - 1);
    };

    const changeActiveAuctions = (activePage: number) => {
        const firstEl = AUCTIONS_PER_PAGE * activePage;
        const lastEl = AUCTIONS_PER_PAGE * activePage + AUCTIONS_PER_PAGE;
        const arr = auctions.slice(firstEl, lastEl);
        setActiveAuctions(arr);
    };

    useEffect(() => {
        changeActiveAuctions(activePage);
    }, [activePage]);

    return (
        <DiscoverView
            onMinPriceRangeChange={onMinPriceRangeChange}
            onMaxPriceRangeChange={onMaxPriceRangeChange}
            priceState={priceState}
            priceStateDefault={PRICE_STATE_DEFAULT}
            priceRangeStyle={priceRangeStyle}
            productsData={activeAuctions}
            activePage={activePage}
            showNextPage={showNextPage}
            showPrevPage={showPrevPage}
        />
    );
};
