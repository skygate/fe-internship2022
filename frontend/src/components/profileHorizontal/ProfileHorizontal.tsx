import React from "react";
import { Link } from "react-router-dom";
import { ProfilePicture } from "../";
import style from "./profileHorizontal.module.scss";

interface Props {
    upperText?: string;
    bottomText?: string;
    imageWidth: string;
    imageUrl?: string;
    linkTo?: string;
}

export const ProfileHorizontal = ({
    upperText,
    bottomText,
    imageWidth,
    imageUrl,
    linkTo,
}: Props) => {
    const content = () => (
        <div className={style.profile}>
            <ProfilePicture width={imageWidth} url={imageUrl} />
            <div className={style.userInfo}>
                <p className={style.function}>{upperText || ""}</p>
                <p className={style.name}>{bottomText || ""}</p>
            </div>
        </div>
    );

    return linkTo ? <Link to={linkTo}>{content()}</Link> : content();
};
