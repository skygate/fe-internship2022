import { useEffect, useLayoutEffect, useRef, useState } from "react";
import style from "./roundButton.module.scss";

interface RoundButtonProps {
    element: JSX.Element;
    onClick: () => void;
    tooltip?: string;
}

export const RoundButton = ({ element, onClick, tooltip }: RoundButtonProps) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    const onButtonClick = () => {
        onClick();
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
