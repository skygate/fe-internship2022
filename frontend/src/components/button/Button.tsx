import style from "./button.module.scss";

enum buttonTypes {
    button = "button",
    submit = "submit",
    reset = "reset",
}

interface ButtonProps {
    type?: buttonTypes;
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
