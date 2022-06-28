import React from "react";
import style from "./smallButton.module.scss";

interface SmallButtonProps {
    text: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const SmallButton = ({ text, onClick }: SmallButtonProps) => {
    return onClick ? (
        <button type="button" className={style.button} onClick={(e) => onClick(e)}>
            {text}
        </button>
    ) : (
        <button type="button" className={style.button}>
            {text}
        </button>
    );
};
