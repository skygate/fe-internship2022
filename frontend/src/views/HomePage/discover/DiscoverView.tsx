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
    priceRangeStyle: { background: string };
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
}: DiscoverProps) => {
    return (
        <section>
            <h3>Discover</h3>
            <form className={style.filters}>
                <div className={style.topFilters}>
                    <select name="timeFilter" id="timeFilter" className={style.timeFilter}>
                        <option value="recentlyAdded">Recently added</option>
                        <option value="month">Monthly</option>
                        <option value="week">Weekly</option>
                        <option value="ever">Ever</option>
                    </select>
                    <div className={style.buttons}>
                        <CategoryButtons />
                    </div>
                    <button type="button" className={style.clearFilters}>
                        Filter x
                    </button>
                </div>
                <div className={style.bottomFilters}>
                    <SelectFilters />
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
