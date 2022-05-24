import React, { useEffect, useState } from "react";
import style from "./categoryButtons.module.scss";
import { DiscoverFormState } from "interfaces";

interface CategoryButtonsProps {
    onCategorySelect: (e: React.MouseEvent) => void;
    formState: DiscoverFormState;
}

export const CategoryButtons = ({ onCategorySelect, formState }: CategoryButtonsProps) => {
    useEffect(() => {
        setActiveElement(formState.category);
    }, [formState]);
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
        id: string;
    }

    const filterCategories: FilterCategory[] = [
        { name: FilterCategoryType.AllItems, label: "All items", id: "all" },
        { name: FilterCategoryType.Art, label: "Art", id: "art" },
        { name: FilterCategoryType.Game, label: "Game", id: "game" },
        { name: FilterCategoryType.Photography, label: "Photography", id: "photography" },
        { name: FilterCategoryType.Music, label: "Music", id: "music" },
        { name: FilterCategoryType.Video, label: "Video", id: "video" },
    ];

    const [activeElement, setActiveElement] = useState(formState.category);

    const getButtonClassName = (id: string) => {
        return id === activeElement ? style.buttonSelect : "";
    };

    const onClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setActiveElement(target.id);
        onCategorySelect(e);
    };

    const renderCategoryButtons = (): JSX.Element => {
        return (
            <>
                {filterCategories.map((item) => {
                    return (
                        <button
                            type="button"
                            className={getButtonClassName(item.id)}
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
