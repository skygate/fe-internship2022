import React from "react";
import { CategoryButtons } from "../";
import { SelectFilters } from "../";
import { NFTProductCard } from "../../components";
import { ExampleNFTList } from "../../constant/ExampleNFTList";
import style from "./discover.module.scss";

interface DiscoverProps {
    priceRangeStyle: { background: string };
    priceRangeMin: number;
    priceRangeMax: number;
    priceRangeDefault: number;
    onMinPriceRangeChange: (e: React.ChangeEvent) => void;
    onMaxPriceRangeChange: (e: React.ChangeEvent) => void;
}

export const DiscoverView = ({
    priceRangeStyle,
    priceRangeMin,
    priceRangeMax,
    priceRangeDefault,
    onMinPriceRangeChange,
    onMaxPriceRangeChange,
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
                                max={priceRangeDefault}
                                step="1"
                                value={priceRangeMin}
                                onChange={(e) => onMinPriceRangeChange(e)}
                            />
                            <input
                                type="range"
                                min="0"
                                max={priceRangeDefault}
                                step="1"
                                value={priceRangeMax}
                                onChange={(e) => onMaxPriceRangeChange(e)}
                            />
                        </div>
                        <div className={style.values}>
                            <p>{priceRangeMin} ETH</p>
                            <p>{priceRangeMax} ETH</p>
                        </div>
                    </div>
                </div>
            </form>
            <div className={style.itemsContainer}>
                {ExampleNFTList.map((author) => (
                    <NFTProductCard key={author.authorName} nft={author} />
                ))}
            </div>
        </section>
    );
};
