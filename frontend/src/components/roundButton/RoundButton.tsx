import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import style from "./roundButton.module.scss";

interface RoundButtonProps {
    element: JSX.Element;
    id?: string;
    onClick: (arg?: string) => void;
    tooltip?: string;
}

export const RoundButton = ({ element, id, onClick, tooltip }: RoundButtonProps) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    const onButtonClick = () => {
        id ? onClick(id) : onClick();

        if (tooltip && spanRef.current) {
            spanRef.current.style.opacity = "1";
            setTimeout(() => {
                if (spanRef.current) spanRef.current.style.opacity = "0";
            }, 1000);
        }
    };

    return (
        <>
            <button type="button" className={style.roundBtn} onClick={onButtonClick}>
                {element}
                {tooltip && (
                    <span ref={spanRef} className={style.tooltipText} id="myTooltip">
                        {tooltip}
                    </span>
                )}
            </button>
        </>
    );
};
