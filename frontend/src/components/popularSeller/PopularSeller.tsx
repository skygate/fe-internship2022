import React, { useState } from "react";
import style from "./popularSeller.module.scss";
import icon from "assets/icon.svg";
import iconPlus from "assets/plusIcon.svg";
import arrow from "assets/arrow45deg.svg";
import { ProfilePicture } from "components";
import { ProfileInterface } from "interfaces";
import { Link } from "react-router-dom";

interface PopularSellerProps {
    profile: ProfileInterface;
    index?: number;
}

export const PopularSeller = ({ profile, index }: PopularSellerProps) => {
    const [hidden, setHidden] = useState(true);

    const onMouseEnter = () => {
        setHidden(false);
    };

    const onMouseLeave = () => {
        setHidden(true);
    };

    return (
        <Link to={`profile/${profile._id}`}>
            <div
                className={
                    hidden ? `${style.popularItem}` : `${style.popularItem} ${style.animation}`
                }
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className={hidden ? style.hidden : style.show}>
                    {index && (
                        <div className={style.badge}>
                            <img src={icon} alt="icon" className={style.icon} />
                            <p>#{index}</p>
                        </div>
                    )}

                    <div className={style.icons}>
                        <img src={iconPlus} alt="go to" className={style.plusIcon} />
                        <img src={arrow} alt="go to" className={style.arrowIcon} />
                    </div>
                </div>

                <div className={style.primaryInfo}>
                    <ProfilePicture width="64px" url={profile.profilePicture} />
                    <p className={style.name}>{profile.profileName}</p>
                    <p className={style.followers}>
                        <span className={style.followersNumber}>{profile.followers?.length}</span>
                        followers
                    </p>
                </div>
            </div>
        </Link>
    );
};
