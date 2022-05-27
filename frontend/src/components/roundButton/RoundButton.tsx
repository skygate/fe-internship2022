import style from "./roundButton.module.scss";

interface RoundButtonProps {
    img: string;
}

export const RoundButton = ({ img }: RoundButtonProps) => {
    return (
        <button type="button" className={style.roundBtn}>
            <img src={img} alt="" />
        </button>
    );
};
