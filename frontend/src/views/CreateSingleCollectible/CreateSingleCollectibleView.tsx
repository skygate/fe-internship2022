import style from "./createSingleCollectible.module.scss";
import { Preview } from "./";
import { CreateSingleCollectibleForm } from "./";

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

interface CreateSingleCollectibleViewProps {
    onInputChange: (e: React.ChangeEvent) => void;
    onToggleChange: (e: React.ChangeEvent) => void;
    onImgSrcChange: (arg: string) => void;
    item: ItemType;
    onClickClear: () => void;
}

export const CreateSingleCollectibleView = ({
    onInputChange,
    onToggleChange,
    onImgSrcChange,
    item,
    onClickClear,
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
                        />
                    </div>
                    <Preview
                        imgUrl={item.imgUrl}
                        itemName={item.itemName}
                        onClickClear={onClickClear}
                    />
                </div>
            </section>
        </>
    );
};
