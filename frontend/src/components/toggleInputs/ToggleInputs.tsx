import React from "react";
import style from "./toggleInputs.module.scss";

interface ToggleInputsProps {
    onToggleChange: (e: React.ChangeEvent) => void;
}

enum ToggleSwitchType {
    PutOnSale,
    InstantSalePrice,
    UnlockOncePurchased,
}

interface ToggleSwitches {
    id: string;
    name: ToggleSwitchType;
    label: string;
    info: string;
}

const toggleSwitchesArray: ToggleSwitches[] = [
    {
        id: "putOnSale",
        name: ToggleSwitchType.PutOnSale,
        label: "Put on sale",
        info: "You'll receive bids on this item",
    },
    {
        id: "instantSellPrice",
        name: ToggleSwitchType.InstantSalePrice,
        label: "Instant sell price",
        info: "Enter the price for which the item will be instantly sold",
    },
    {
        id: "unlockOncePurchased",
        name: ToggleSwitchType.UnlockOncePurchased,
        label: "Unlock once purchased",
        info: "Content will be unlocked after succesfull transaction",
    },
];
export const ToggleInputs = ({ onToggleChange }: ToggleInputsProps) => {
    return (
        <div>
            {toggleSwitchesArray.map((item: any) => {
                return (
                    <div className={style.toggleSwitchInput} key={item.id}>
                        <div>
                            <p className={style.switchName}>{item.label}</p>
                            <p className={style.switchInfo}>{item.info}</p>
                        </div>

                        <div className={style.toggleSwitch}>
                            <label className={style.switch}>
                                <input type="checkbox" onChange={onToggleChange} id={item.id} />
                                <span className={style.toggle}></span>
                            </label>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
