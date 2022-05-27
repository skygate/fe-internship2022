import style from "./button.module.scss";

interface ButtonProps {
    text: string;
    blue: boolean;
}

export const Button = ({ text, blue }: ButtonProps) => {
    return (
        <button type="button" className={blue ? style.buttonPrimary : style.buttonSecondary}>
            {text}
        </button>
    );
};
