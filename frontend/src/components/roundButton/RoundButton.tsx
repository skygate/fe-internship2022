import style from "./roundButton.module.scss";

interface RoundButtonProps {
    element: JSX.Element;
    onClick?: (e: React.MouseEvent) => void;
}

export const RoundButton = ({ element, onClick }: RoundButtonProps) => {
    return (
        <button type="button" className={style.roundBtn} onClick={onClick}>
            {element}
        </button>
    );
};
