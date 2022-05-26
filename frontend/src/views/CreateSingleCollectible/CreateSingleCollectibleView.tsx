import style from "./createSingleCollectible.module.scss";
import { Preview } from "./";
import { CreateSingleCollectibleForm } from "./";
import React from "react";
import { InputFileChange } from "../../interfaces/file";
import { Product } from "../../interfaces/product";

interface CreateSingleCollectibleViewProps {
    onInputChange: (e: React.ChangeEvent) => void;
    onToggleChange: (e: React.ChangeEvent) => void;
    onImgSrcChange: (arg: InputFileChange) => void;
    item: Product;
    onClickClear: () => void;
    onFormSubmit: (e: React.FormEvent) => void;
}

export const CreateSingleCollectibleView = ({
    onInputChange,
    onToggleChange,
    onImgSrcChange,
    item,
    onClickClear,
    onFormSubmit,
}: CreateSingleCollectibleViewProps) => {
    return (
        <>
            <section className={style.section}>
                <div className={style.sectionContainer}>
                    <div className={style.formContainer}>
                        <h2 className={style.h2}>Create single collectible</h2>
                        <CreateSingleCollectibleForm
                            onInputChange={onInputChange}
                            onToggleChange={onToggleChange}
                            onImgSrcChange={onImgSrcChange}
                            onFormSubmit={onFormSubmit}
                        />
                    </div>
                    <Preview
                        imgUrl={item.productImageUrl}
                        itemName={item.productName}
                        onClickClear={onClickClear}
                    />
                </div>
            </section>
        </>
    );
};
