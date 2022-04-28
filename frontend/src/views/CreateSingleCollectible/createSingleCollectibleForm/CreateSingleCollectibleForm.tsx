import React from "react";
import style from "./createSingleCollectibleForm.module.scss";
import { ToggleInputs } from "components";
import { WideTextInputs } from "components";
import { RowTextInputs } from "components";
import { UploadFile } from "components";

import icon from "assets/arrowRight.svg";

const SEND_FORM_URL = "http://localhost:8000/products";

interface FormProps {
    onInputChange: (e: React.ChangeEvent) => void;
    onToggleChange: (e: React.ChangeEvent) => void;
    onImgSrcChange: (arg: string) => void;
    item: {};
}

export const CreateSingleCollectibleForm = ({
    onInputChange,
    onToggleChange,
    onImgSrcChange,
    item,
}: FormProps) => {
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(SEND_FORM_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });
    };

    return (
        <form className={style.form} onSubmit={onFormSubmit}>
            <UploadFile onImgSrcChange={onImgSrcChange} />
            <p className={style.formHeader}>Item Details</p>
            <WideTextInputs onInputChange={onInputChange} />
            <RowTextInputs onInputChange={onInputChange} />
            <ToggleInputs onToggleChange={onToggleChange} />
            <button type="submit" className={style.submitButton}>
                Create item
                <img src={icon} alt="arrow icon" />
            </button>
        </form>
    );
};
