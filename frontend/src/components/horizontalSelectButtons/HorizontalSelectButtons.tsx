import React, { useEffect, useState } from "react";
import style from "./horizontalSelectButtons.module.scss";
import ButtonInterface from "components/horizontalSelectButtons/interface";

interface HorizontalSelectButtonsProps {
    buttons: ButtonInterface[];
    onSelect: (e: React.MouseEvent) => void;
}

export const HorizontalSelectButtons = ({ buttons, onSelect }: HorizontalSelectButtonsProps) => {
    const [activeElement, setActiveElement] = useState(buttons[0].id);

    const getButtonClassName = (id: string) => {
        return id === activeElement ? style.buttonSelect : style.button;
    };

    const onClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setActiveElement(target.id);
        onSelect(e);
    };

    const renderCategoryButtons = (): JSX.Element => {
        return (
            <div className={style.container}>
                {buttons.map((item) => {
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
            </div>
        );
    };

    return <>{renderCategoryButtons()}</>;
};
