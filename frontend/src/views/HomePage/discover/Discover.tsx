import React, { useEffect, useState } from "react";
import { DiscoverView } from "./DiscoverView";
import { useAppDispatch, useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";
import { getAuctions } from "store/auctions";
import { useSearchParams } from "react-router-dom";
import { DiscoverFormState } from "interfaces";

const PRICE_GAP = 20;
const AUCTIONS_PER_PAGE = 8;
const INITIAL_STYLE = {
    background: `linear-gradient(to right, #E6E8EC 0% , #3772ff 0% , #3772ff 100%, #E6E8EC 100%)`,
};

const FORM_STATE_DEFAULT: DiscoverFormState = {
    category: "all",
    time: "ever",
    sort: "startDate",
    ascending: "-1",
    priceMin: 0,
    priceMax: 2000,
    priceRangeMin: 0,
    priceRangeMax: 2000,
};

const calculatePercentage = (nominator: number, denominator: number) =>
    (nominator / denominator) * 100;

export const Discover = () => {
    const auctions = useAppSelector((state) => state.auctions.auctions);
    const [activeAuctions, setActiveAuctions] = useState<AuctionItem[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [formState, setFormState] = useState(FORM_STATE_DEFAULT);
    const [priceInputBackground, setPriceInputBackground] = useState(INITIAL_STYLE);
    const [searchParams, setSearchParams] = useSearchParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const time = urlParams.get("time") || FORM_STATE_DEFAULT.time;
        const sortBy = urlParams.get("sortBy") || FORM_STATE_DEFAULT.sort;
        const ascending = urlParams.get("ascending") || FORM_STATE_DEFAULT.ascending;
        const category = urlParams.get("category") || FORM_STATE_DEFAULT.category;
        const priceMin = Number(urlParams.get("priceMin")) || FORM_STATE_DEFAULT.priceMin;
        const priceMax = Number(urlParams.get("priceMax")) || FORM_STATE_DEFAULT.priceMax;
        setFormState({
            ...formState,
            category: category,
            time: time,
            sort: sortBy,
            ascending: ascending,
            priceMin: Number(priceMin),
            priceMax: Number(priceMax),
        });
    }, []);

    useEffect(() => {
        searchParams.set("time", formState.time);
        searchParams.set("sort", formState.sort);
        searchParams.set("ascending", formState.ascending);
        searchParams.set("category", formState.category);
        searchParams.set("priceMin", formState.priceMin.toString());
        searchParams.set("priceMax", formState.priceMax.toString());
        setSearchParams(searchParams);
        fillColor();
    }, [formState]);

    useEffect(() => {
        const firstPageAuctions = auctions.slice(0, AUCTIONS_PER_PAGE);
        setActiveAuctions(firstPageAuctions);
    }, [auctions]);

    useEffect(() => {
        dispatch(getAuctions(true));
    }, [searchParams]);

    useEffect(() => {
        changeVisibleAuctions(activePage);
    }, [activePage]);

    const onFilterSelect = (e: React.ChangeEvent) => {
        e.preventDefault();
        const target = e.target as HTMLSelectElement;

        if (target.id === "sort") {
            const ascending =
                target.selectedOptions[0].getAttribute("data-ascending") ||
                FORM_STATE_DEFAULT.ascending;
            const filterBy =
                target.selectedOptions[0].getAttribute("data-filterby") || FORM_STATE_DEFAULT.sort;
            setFormState({
                ...formState,
                sort: filterBy,
                ascending: ascending,
            });
        }
        if (target.id === "timeFilter") {
            setFormState({ ...formState, time: target.value });
        }
    };

    const onCategorySelect = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setFormState({ ...formState, category: target.id });
    };

    const checkGap = (priceMin: number, priceMax: number, gap: number) =>
        priceMax - priceMin >= gap ? true : false;

    const onPriceChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const check = checkGap(formState.priceMin, formState.priceMax, PRICE_GAP);

        return check
            ? setFormState({ ...formState, [target.id]: Number(target.value) })
            : target.id === "priceMin"
            ? setFormState({ ...formState, priceMin: formState.priceMax - PRICE_GAP })
            : target.id === "priceMax"
            ? setFormState({ ...formState, priceMax: formState.priceMin + PRICE_GAP })
            : null;
    };

    const fillColor = () => {
        const percent1 = calculatePercentage(formState.priceMin, formState.priceRangeMax);
        const percent2 = calculatePercentage(formState.priceMax, formState.priceRangeMax);

        setPriceInputBackground({
            background: `linear-gradient(to right, #E6E8EC ${percent1}% , #3772ff ${percent1}% , #3772ff ${percent2}%, #E6E8EC ${percent2}%)`,
        });
    };

    const onPageChange = (e: React.MouseEvent) => {
        const target = e.target as HTMLImageElement;
        if (target.id === "nextPage") {
            const lastPageIndex = Math.ceil(auctions.length / AUCTIONS_PER_PAGE);
            if (activePage + 1 >= lastPageIndex) return;
            setActivePage(activePage + 1);
        }

        if (target.id === "prevPage") {
            if (activePage === 0) return;
            setActivePage(activePage - 1);
        }
    };

    const changeVisibleAuctions = (activePage: number) => {
        const firstAuction = AUCTIONS_PER_PAGE * activePage;
        const lastAuction = AUCTIONS_PER_PAGE * activePage + AUCTIONS_PER_PAGE;
        const visibleAuctionsArray = auctions.slice(firstAuction, lastAuction);
        setActiveAuctions(visibleAuctionsArray);
    };

    const clearFilters = (e: React.MouseEvent) => {
        setFormState(FORM_STATE_DEFAULT);
    };

    return (
        <DiscoverView
            formState={formState}
            onPriceChange={onPriceChange}
            priceInputBackground={priceInputBackground}
            productsData={activeAuctions}
            onFilterSelect={onFilterSelect}
            onCategorySelect={onCategorySelect}
            onPageChange={onPageChange}
            clearFilters={clearFilters}
        />
    );
};
