import React from "react";
import style from "./createSingleCollectibleForm.module.scss";
import { ToggleInputs } from "components";
import { WideTextInputs } from "components";
import { RowTextInputs } from "components";
import { UploadFile } from "components";
import icon from "assets/arrowRight.svg";

interface FormProps {
    onInputChange: (e: React.ChangeEvent) => void;
    onToggleChange: (e: React.ChangeEvent) => void;
    onImgSrcChange: (arg: string) => void;
}

export const CreateSingleCollectibleForm = ({
    onInputChange,
    onToggleChange,
    onImgSrcChange,
}: FormProps) => {
    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                <img src={icon} alt="" />
            </button>
        </form>
    );
};
