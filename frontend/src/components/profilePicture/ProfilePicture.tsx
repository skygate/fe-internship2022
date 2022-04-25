import React from "react";

interface Props {
  width: string;
  url?: string;
}

export const ProfilePicture = ({width, url}:Props) => {

  const style = {
    width: `${width}`,
    height: `${width}`,
    borderRadius: '50%',
    marginRight: '0.5rem',
  };

  return (
    <img src={url} alt="profile" style={style} />
  )
}