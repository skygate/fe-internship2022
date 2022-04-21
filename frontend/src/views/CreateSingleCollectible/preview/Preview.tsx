import React from "react";
import style from "./preview.module.scss";
import { NFTProductCard } from "components";
import clearIcon from "assets/clearButtonIcon.svg";

interface PreviewProps {
    imgUrl: string;
    itemName: string;
    itemPrice?: number;
    onClickClear: (e: React.MouseEvent) => void;
}

let author = {
    profilePic: "https://www.fairtravel4u.org/wp-content/uploads/2018/06/sample-profile-pic.png",
    NFTS: [
        {
            nftUrl: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=900.0&fit=crop",
            price: 0.0,
            title: "example1.1",
        },
    ],
};

export const Preview = ({ imgUrl, itemName, itemPrice, onClickClear }: PreviewProps) => {
    const NFTS = [
        {
            nftUrl: imgUrl,
            price: itemPrice ?? 0.25,
            title: itemName,
        },
    ];

    author = { ...author, NFTS: NFTS };

    return (
        <div className={style.preview}>
            <h2 className={style.title}>Preview</h2>
            <NFTProductCard nft={author} />
            <button type="button" onClick={onClickClear} className={style.button}>
                <img src={clearIcon} alt="clear icon" />
                Clear all
            </button>
        </div>
    );
};
