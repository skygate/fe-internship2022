import style from "./addBidModal.module.scss";
import { Button } from "components";
import { useAppSelector } from "store/store";
import React, { useState } from "react";
import { BidOffer } from "interfaces";
import { ButtonTypes } from "interfaces";
import activeProfile from "store/activeProfile";

interface AddBidModalProps {
    onPlaceBid: (data: BidOffer) => void;
    onClose: () => void;
}

export const AddBidModal = ({ onPlaceBid, onClose }: AddBidModalProps) => {
    const profile = useAppSelector((state) => state.activeProfile.activeProfile);
    const user = useAppSelector((state) => state.user);
    const [inputValue, setInputValue] = useState("0");
    const onCancelButtonClick = () => onClose();
    const onInputValueChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setInputValue(target.value);
    };

    const onBidButtonClick = () => {
        if (!profile) return;
        const data = {
            profileID: profile._id,
            offer: Number(inputValue),
        };
        onPlaceBid(data);
        onClose();
    };

    return (
        <form className={style.form}>
            <label htmlFor="bidValue">Bid value</label>
            <input type="number" id="bidValue" value={inputValue} onChange={onInputValueChange} />
            <div className={style.buttons}>
                <Button text="Cancel" id="cancelButton" onClick={onCancelButtonClick} />
                <Button
                    type={ButtonTypes.submit}
                    text="Place Bid"
                    id="bidButton"
                    blue={true}
                    onClick={onBidButtonClick}
                />
            </div>
        </form>
    );
};
