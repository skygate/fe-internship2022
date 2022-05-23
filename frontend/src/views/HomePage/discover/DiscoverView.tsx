import React from "react";
import { CategoryButtons } from "components";
import { SelectFilters } from "components";
import { ProductCard } from "components";
import style from "./discover.module.scss";
import leftArrow from "assets/arrowLeft.svg";
import rightArrow from "assets/arrowRight.svg";

import { AuctionItem } from "interfaces/index";

interface PriceState {
    priceRangeMin: number;
    priceRangeMax: number;
}

interface DiscoverProps {
    priceRangeStyle: { background: string };
    priceState: PriceState;
    priceStateDefault: PriceState;
    productsData: AuctionItem[];
    onMinPriceRangeChange: (e: React.ChangeEvent) => void;
    onMaxPriceRangeChange: (e: React.ChangeEvent) => void;
    activePage: number;
    showNextPage: (e: React.MouseEvent) => void;
    showPrevPage: (e: React.MouseEvent) => void;
    onFieldSelect: (e: React.ChangeEvent) => void;
    onCategorySelect: (e: React.MouseEvent) => void;
}

export const DiscoverView = ({
    priceState,
    priceStateDefault,
    priceRangeStyle,
    onMinPriceRangeChange,
    onMaxPriceRangeChange,
    productsData,
    activePage,
    showNextPage,
    showPrevPage,
    onFieldSelect,
    onCategorySelect,
}: DiscoverProps) => {
    return (
        <section id="discover">
            <h3>Discover</h3>
            <form className={style.filters}>
                <div className={style.topFilters}>
                    <div className={style.buttons}>
                        <CategoryButtons onCategorySelect={onCategorySelect} />
                    </div>
                </div>
                <div className={style.bottomFilters}>
                    <button type="button" className={style.clearFilters}>
                        Filter x
                    </button>
                    <div className={style.selectFilters}>
                        <SelectFilters onFieldSelect={onFieldSelect} />
                        <div className={style.priceRange}>
                            <label htmlFor="priceRange">PRICE RANGE</label>
                            <div className={style.priceRangeContainer}>
                                <div className={style.sliderTrack} style={priceRangeStyle}></div>
                                <input
                                    type="range"
                                    min="0"
                                    max={priceStateDefault.priceRangeMax}
                                    step="1"
                                    value={priceState.priceRangeMin}
                                    onChange={(e) => onMinPriceRangeChange(e)}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max={priceStateDefault.priceRangeMax}
                                    step="1"
                                    value={priceState.priceRangeMax}
                                    onChange={(e) => onMaxPriceRangeChange(e)}
                                />
                            </div>
                            <div className={style.values}>
                                <p>{priceState.priceRangeMin} ETH</p>
                                <p>{priceState.priceRangeMax} ETH</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className={style.itemsContainer}>
                {productsData !== []
                    ? productsData.map((item, index) => <ProductCard key={index} item={item} />)
                    : "Nie znaleziono produktów"}
            </div>
            <div className={style.selectPage}>
                <img
                    src={leftArrow}
                    alt="arrow left"
                    className={style.arrow}
                    onClick={showPrevPage}
                />
                <img
                    src={rightArrow}
                    alt="arrow right"
                    className={style.arrow}
                    onClick={showNextPage}
                />
            </div>
        </section>
    );
};
