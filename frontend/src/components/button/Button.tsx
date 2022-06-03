import style from "./button.module.scss";
import { ButtonTypes } from "interfaces";

interface ButtonProps {
    type?: ButtonTypes;
    text: string;
    blue?: boolean;
    id?: string;
    onClick?: (arg?: string) => void;
}

export const Button = ({ type, text, blue, id, onClick }: ButtonProps) => {
    return !onClick ? (
        <button
            type={type ?? "button"}
            className={blue ? style.buttonPrimary : style.buttonSecondary}
        >
            {text}
        </button>
    ) : (
        <button
            type={type ?? "button"}
            className={blue ? style.buttonPrimary : style.buttonSecondary}
            onClick={() => onClick(id)}
        >
            {text}
        </button>
    );
};
