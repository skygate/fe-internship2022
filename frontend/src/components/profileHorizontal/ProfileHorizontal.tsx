import React from "react";
import { ProfilePicture } from '../';
import style from './profileHorizontal.module.scss';

interface Props {
  upperText?: string;
  bottomText?: string;
  imageWidth: string;
  imageUrl?: string;
}

export const ProfileHorizontal = ({upperText, bottomText, imageWidth, imageUrl}:Props) => {
  return (
    <div className={style.profile}>
      <ProfilePicture width={imageWidth} url={imageUrl} />
      <div className={style.userInfo}>
        <p className={style.function}>{upperText ? upperText : 'default'}</p>
        <p className={style.name}>{bottomText ? bottomText : 'default'}</p>            
      </div>
    </div>
  )
}