import React, { useState } from "react";
import { CreateSingleCollectibleView } from "./CreateSingleCollectibleView";

interface ItemType {
    itemName: string;
    itemDescription: string;
    imgUrl: string;
    itemSize: string;
    itemProperties: string;
    itemRoyality: string;
    putOnSale: boolean;
    instantSellPrice: boolean;
    unlockOncePurchased: boolean;
}

const defaultItem: ItemType = {
    itemName: "Example Item Name",
    itemDescription: "Example Item Description",
    imgUrl: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=900.0&fit=crop",
    itemSize: "5",
    itemProperties: "Example properties",
    itemRoyality: "10%",
    putOnSale: false,
    instantSellPrice: false,
    unlockOncePurchased: false,
};

export const CreateSingleCollectible = () => {
    const [item, setItem] = useState<ItemType>(defaultItem);

    const onImgSrcChange = (arg: string) => {
        setItem({ ...item, imgUrl: arg });
    };

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setItem({ ...item, [target.id]: target.value });
    };

    const onToggleChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setItem({ ...item, [target.id]: target.checked });
    };

    const onClickClear = () => {
        setItem(defaultItem);
    };

    return (
        <CreateSingleCollectibleView
            onInputChange={onInputChange}
            onToggleChange={onToggleChange}
            onImgSrcChange={onImgSrcChange}
            item={item}
            onClickClear={onClickClear}
        />
    );
};
