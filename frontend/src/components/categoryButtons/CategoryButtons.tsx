import React, { useState } from "react";
import style from "./categoryButtons.module.scss";

export const CategoryButtons = () => {
    enum FilterCategoryType {
        AllItems,
        Art,
        Game,
        Photography,
        Music,
        Video,
    }

    interface FilterCategory {
        name: FilterCategoryType;
        label: string;
    }

    const filterCategories: FilterCategory[] = [
        { name: FilterCategoryType.AllItems, label: "All items" },
        { name: FilterCategoryType.Art, label: "Art" },
        { name: FilterCategoryType.Game, label: "Game" },
        { name: FilterCategoryType.Photography, label: "Photography" },
        { name: FilterCategoryType.Music, label: "Music" },
        { name: FilterCategoryType.Video, label: "Video" },
    ];

    const [activeElement, setActiveElement] = useState(filterCategories[0].label);

    const getButtonClassName = (label: any) => {
        return label === activeElement ? style.buttonSelect : "";
    };

    const onClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setActiveElement(target.value);
    };

    const renderCategoryButtons = (): JSX.Element => {
        return (
            <>
                {filterCategories.map((item) => {
                    return (
                        <button
                            type="button"
                            className={getButtonClassName(item.label)}
                            onClick={onClick}
                            value={item.label}
                            key={item.label}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </>
        );
    };

    return <>{renderCategoryButtons()}</>;
};
