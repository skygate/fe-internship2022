import style from "./activity.module.scss";
import { Button, HorizontalSelectButtons, CheckboxInput, Notification } from "components";
import React, { useState } from "react";
import { menuButtons, filterOptions } from "./arrays";

interface FilterStateInterface {
    sales: boolean;
    purchase: boolean;
    bids: boolean;
    likes: boolean;
}

const DEFAULT_FILTER_STATE: FilterStateInterface = {
    sales: false,
    purchase: false,
    bids: false,
    likes: false,
};

const exampleResponse = [
    {
        message: "You placed a undefined$ bid!",
        title: "Bid placed",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1654605094/bozgbakipzgqti9kjhnt.jpg",
        date: "Fri Jun 24 2022 14:54:50 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
    {
        message: "You placed a undefined$ bid!",
        title: "Bid placed",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1654605094/bozgbakipzgqti9kjhnt.jpg",
        date: "Fri Jun 24 2022 14:54:50 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
    null,
    {
        message: "Fast Ryback is now on sale!",
        title: "New auction started!",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1654596368/qopjauf6ot4v7wd7smv8.gif",
        date: "Fri Jun 24 2022 15:27:43 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
    {
        message: "You placed a 2100$ bid!",
        title: "Bid placed",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1654608296/z4anbornmlrkuwxewvot.jpg",
        date: "Fri Jun 24 2022 15:38:23 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
    {
        message: "Dama has new 2100$ bid!",
        title: "New bid!",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1654608296/z4anbornmlrkuwxewvot.jpg",
        date: "Fri Jun 24 2022 15:38:24 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
    {
        message: "Ryback is now following you!",
        title: "New follower!",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1655715201/noxkwycxotvaxhq50mag.gif",
        date: "Fri Jun 24 2022 16:17:59 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
    {
        message: "Cat developer is now on sale!",
        title: "New auction started!",
        imageURL:
            "http://res.cloudinary.com/nftskymarketplace/image/upload/v1654596841/rrbumd5f4qrk2ttwgubm.gif",
        date: "Fri Jun 24 2022 16:21:38 GMT+0200 (czas środkowoeuropejski letni)",
        objectURL: "/",
    },
];

export const Activity = () => {
    const [selectedCategory, setSelectedCategory] = useState("myActivity");
    const [selectedFilters, setSelectedFilters] = useState(DEFAULT_FILTER_STATE);

    const onCategorySelect = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setSelectedCategory(target.id);
    };

    const onFilterSelect = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setSelectedFilters({
            ...selectedFilters,
            [target.id]: !selectedFilters[target.id as keyof FilterStateInterface],
        });
    };

    const onSelectAll = () => {
        setSelectedFilters({
            sales: true,
            purchase: true,
            bids: true,
            likes: true,
        });
    };

    const onUnselectAll = () => {
        setSelectedFilters(DEFAULT_FILTER_STATE);
    };

    return (
        <div className={style.activity}>
            <div className={style.leftColumn}>
                <div className={style.titleWrapper}>
                    <h2 className={style.title}>Activity</h2>
                    <button type="button" className={style.button}>
                        Mark as read
                    </button>
                </div>
                <HorizontalSelectButtons buttons={menuButtons} onSelect={onCategorySelect} />
                <div className={style.notifications}>
                    {exampleResponse.map((item) => item && <Notification object={item} />)}
                </div>
            </div>
            <div className={style.filtersWrapper}>
                <h3 className={style.filtersTitle}>Filters</h3>
                {filterOptions.map((item) => (
                    <CheckboxInput
                        key={item.label}
                        label={item.label}
                        id={item.id}
                        onClick={onFilterSelect}
                        checked={selectedFilters[item.id as keyof FilterStateInterface]}
                    />
                ))}

                <div className={style.buttons}>
                    <button type="button" className={style.button} onClick={onSelectAll}>
                        Select all
                    </button>
                    <button type="button" className={style.button} onClick={onUnselectAll}>
                        Unselect all
                    </button>
                </div>
            </div>
        </div>
    );
};
