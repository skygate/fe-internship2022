import React, { useEffect } from "react";
import { CategoryButtons } from "components";
import { SelectFilters } from "components";
import { ProductCard } from "components";
import style from "./discover.module.scss";
import leftArrow from "assets/arrowLeft.svg";
import rightArrow from "assets/arrowRight.svg";
import { AuctionItem } from "interfaces/index";
import { DiscoverFormState } from "interfaces";

interface DiscoverProps {
    priceInputBackground: {};
    productsData: AuctionItem[];
    onPriceChange: (e: React.ChangeEvent) => void;
    onFilterSelect: (e: React.ChangeEvent) => void;
    onCategorySelect: (e: React.MouseEvent) => void;
    onPageChange: (e: React.MouseEvent) => void;
    clearFilters: (e: React.MouseEvent) => void;
    formState: DiscoverFormState;
}

export const DiscoverView = ({
    priceInputBackground,
    onPriceChange,
    productsData,
    onFilterSelect,
    onCategorySelect,
    onPageChange,
    clearFilters,
    formState,
}: DiscoverProps) => {
    return (
        <section id="discover">
            <h3>Discover</h3>
            <form className={style.filters}>
                <div className={style.topFilters}>
                    <div className={style.buttons}>
                        <CategoryButtons
                            onCategorySelect={onCategorySelect}
                            formState={formState}
                        />
                    </div>
                </div>
                <div className={style.bottomFilters}>
                    <button type="button" className={style.clearFilters} onClick={clearFilters}>
                        Filter x
                    </button>
                    <div className={style.selectFilters}>
                        <SelectFilters onFieldSelect={onFilterSelect} formState={formState} />
                        <div className={style.priceRange}>
                            <label htmlFor="priceRange">PRICE RANGE</label>
                            <div className={style.priceRangeContainer}>
                                <div
                                    className={style.sliderTrack}
                                    style={priceInputBackground}
                                ></div>
                                <input
                                    type="range"
                                    min="0"
                                    max={formState.priceRangeMax}
                                    step="1"
                                    value={formState.priceMin}
                                    id="priceMin"
                                    onChange={(e) => onPriceChange(e)}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max={formState.priceRangeMax}
                                    step="1"
                                    value={formState.priceMax}
                                    id="priceMax"
                                    onChange={(e) => onPriceChange(e)}
                                />
                            </div>
                            <div className={style.values}>
                                <p>{formState.priceMin} ETH</p>
                                <p>{formState.priceMax} ETH</p>
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
                    id="prevPage"
                    onClick={(e) => onPageChange(e)}
                />
                <img
                    src={rightArrow}
                    alt="arrow right"
                    className={style.arrow}
                    id="nextPage"
                    onClick={(e) => onPageChange(e)}
                />
            </div>
        </section>
    );
};
