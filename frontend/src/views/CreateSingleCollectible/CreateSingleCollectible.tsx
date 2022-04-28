import React, { useState } from "react";
import { CreateSingleCollectibleView } from "./CreateSingleCollectibleView";

interface Product {
    productId: null;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productCategory: string;
}

const defaultItem: Product = {
    productId: null,
    productName: "exampleName100",
    productDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    productImageUrl: "https://picsum.photos/id/99/200",
    productCategory: "category",
};

export const CreateSingleCollectible = () => {
    const [item, setItem] = useState<Product>(defaultItem);

    const onImgSrcChange = (arg: string) => {
        setItem({ ...item, productImageUrl: arg });
    };

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        console.log(target.id);
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
