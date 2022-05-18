import React, { useEffect, useState } from "react";
import { DiscoverView } from "./DiscoverView";
import { useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";

const PRICE_GAP = 20;
const PRICE_RANGE_DEFAULT = 300;
const AUCTIONS_PER_PAGE = 8;
const INITIAL_STYLE = {
    background: `linear-gradient(to right, #E6E8EC 0% , #3772ff 0% , #3772ff 100%, #E6E8EC 100%)`,
};

export const Discover = () => {
    const auctions = useAppSelector((state) => state.auctions.auctions);
    const [priceRangeMin, setPriceRangeMin] = useState(0);
    const [priceRangeMax, setPriceRangeMax] = useState(PRICE_RANGE_DEFAULT);
    const [priceRangeStyle, setPriceRangeStyle] = useState(INITIAL_STYLE);
    const [activeAuctions, setActiveAuctions] = useState<AuctionItem[]>([]);
    const [activePage, setActivePage] = useState(0);

    useEffect(() => {
        const firstPageAuctions = auctions.slice(0, AUCTIONS_PER_PAGE);
        setActiveAuctions(firstPageAuctions);
    }, [auctions]);

    const calculatePercentage = (nominator: number, denominator: number) =>
        (nominator / denominator) * 100;

    const setPriceRangeBackground = (percent1: number, percent2: number) =>
        setPriceRangeStyle({
            background: `linear-gradient(to right, #E6E8EC ${percent1}% , #3772ff ${percent1}% , #3772ff ${percent2}%, #E6E8EC ${percent2}%)`,
        });

    const fillColor = () => {
        const percent1 = calculatePercentage(priceRangeMin, PRICE_RANGE_DEFAULT);
        const percent2 = calculatePercentage(priceRangeMax, PRICE_RANGE_DEFAULT);
        setPriceRangeBackground(percent1, percent2);
    };

    const checkGap = (priceMin: number, priceMax: number, gap: number) =>
        priceMax - priceMin >= gap ? true : false;

    const onMinPriceRangeChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        checkGap(priceRangeMin, priceRangeMax, PRICE_GAP)
            ? setPriceRangeMin(Number(target.value))
            : setPriceRangeMin(priceRangeMax - PRICE_GAP);
        fillColor();
    };

    const onMaxPriceRangeChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;

        checkGap(priceRangeMin, priceRangeMax, PRICE_GAP)
            ? setPriceRangeMax(Number(target.value))
            : setPriceRangeMax(priceRangeMin + PRICE_GAP);

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
            priceRangeStyle={priceRangeStyle}
            priceRangeMin={priceRangeMin}
            priceRangeMax={priceRangeMax}
            priceRangeDefault={PRICE_RANGE_DEFAULT}
            productsData={activeAuctions}
            activePage={activePage}
            showNextPage={showNextPage}
            showPrevPage={showPrevPage}
        />
    );
};
