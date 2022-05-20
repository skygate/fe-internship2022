import React, { useState } from "react";
import style from "./categoryButtons.module.scss";

interface CategoryButtonsProps {
    onCategorySelect: (e: React.MouseEvent) => void;
}

export const CategoryButtons = ({ onCategorySelect }: CategoryButtonsProps) => {
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
        id?: string;
    }

    const filterCategories: FilterCategory[] = [
        { name: FilterCategoryType.AllItems, label: "All items", id: "all" },
        { name: FilterCategoryType.Art, label: "Art", id: "art" },
        { name: FilterCategoryType.Game, label: "Game", id: "game" },
        { name: FilterCategoryType.Photography, label: "Photography", id: "photography" },
        { name: FilterCategoryType.Music, label: "Music", id: "music" },
        { name: FilterCategoryType.Video, label: "Video", id: "video" },
    ];

    const [activeElement, setActiveElement] = useState(filterCategories[0].label);

    const getButtonClassName = (label: any) => {
        return label === activeElement ? style.buttonSelect : "";
    };

    const onClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setActiveElement(target.value);
        onCategorySelect(e);
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
                            id={item.id}
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
