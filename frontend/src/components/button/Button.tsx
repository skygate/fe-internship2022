import style from "./button.module.scss";
import { ButtonTypes } from "interfaces";

interface ButtonProps {
    type?: ButtonTypes;
    text: string;
    blue?: boolean;
    id: string;
    onClick: (e: React.MouseEvent, arg?: string) => void;
}

export const Button = ({ type, text, blue, id, onClick }: ButtonProps) => {
    return (
        <button
            type={type ?? "button"}
            className={blue ? style.buttonPrimary : style.buttonSecondary}
            onClick={(e) => onClick(e, id)}
        >
            {text}
        </button>
    );
};
