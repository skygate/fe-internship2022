import React, { useState } from "react";
import style from "./popularItem.module.scss";
import icon from "assets/icon.svg";
import iconPlus from "assets/plusIcon.svg";
import arrow from "assets/arrow45deg.svg";
import { ProfilePicture } from "components";

interface PopularItemProps {
    imageUrl: string;
    name: string;
    ethValue: number;
    rangingNumber: number;
}

export const PopularItem = ({ imageUrl, name, ethValue, rangingNumber }: PopularItemProps) => {
    const [hidden, setHidden] = useState<boolean>(true);

    const onMouseEnter = () => {
        setHidden(false);
    };

    const onMouseLeave = () => {
        setHidden(true);
    };

    return (
        <div
            className={hidden ? `${style.popularItem}` : `${style.popularItem} ${style.animation}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={hidden ? style.hidden : style.show}>
                <div className={style.badge}>
                    <img src={icon} alt="icon" className={style.icon} />
                    <p>#{rangingNumber}</p>
                </div>
                <div className={style.icons}>
                    <img src={iconPlus} alt="go to" className={style.plusIcon} />
                    <img src={arrow} alt="go to" className={style.arrowIcon} />
                </div>
            </div>

            <div className={style.primaryInfo}>
                <ProfilePicture width="64px" url={imageUrl} />
                <p className={style.name}>{name}</p>
                <p className={style.ethValue}>
                    <span className={style.ethValueBold}>{ethValue}</span> ETH
                </p>
            </div>
        </div>
    );
};
