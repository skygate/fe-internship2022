import React from "react";
import { CategoryButtons } from "components";
import { SelectFilters } from "components";
import { ProductCard } from "components";
import style from "./discover.module.scss";

import { AuctionItem } from "interfaces/index";

interface DiscoverProps {
    priceRangeStyle: { background: string };
    priceRangeMin: number;
    priceRangeMax: number;
    priceRangeDefault: number;
    productsData: [] | undefined;
    onMinPriceRangeChange: (e: React.ChangeEvent) => void;
    onMaxPriceRangeChange: (e: React.ChangeEvent) => void;
}

const product: AuctionItem = {
    _id: "6278c5af91f277cb5b7a67af",
    profileID: "6278c3cd91f277cb5b7a679c",
    productID: {
        _id: "6278c4c291f277cb5b7a67a2",
        ownerID: "6278c3cd91f277cb5b7a679c",
        productName: "testItem12",
        productDescription: "loremipsum",
        productImageUrl: "https://cdn.pixabay.com/photo/2020/05/04/10/18/cat-5128568__340.jpg",
        productCategory: "6273c2700c3805793434ec32",
    },
    price: 15,
    amount: 1,
    bidHistory: [],
    startDate: "2022-05-09T07:41:35.211Z",
    endDate: "2022-05-10T07:41:35.211Z",
    likes: 0,
    __v: 0,
};

export const DiscoverView = ({
    priceRangeStyle,
    priceRangeMin,
    priceRangeMax,
    priceRangeDefault,
    onMinPriceRangeChange,
    onMaxPriceRangeChange,
    productsData,
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
                {/* {productsData
                    ? productsData.map((item, index) => <ProductCard key={index} item={item} />)
                    : "Nie znaleziono produktów"} */}
                <ProductCard item={product} />
            </div>
        </section>
    );
};
