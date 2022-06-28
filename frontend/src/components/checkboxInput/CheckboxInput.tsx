import React from "react";
import style from "./checkboxInput.module.scss";

interface CheckboxInputProps {
    label: string;
    id: string;
    onClick: (e: React.ChangeEvent) => void;
    checked?: boolean;
}

export const CheckboxInput = ({ label, id, onClick, checked }: CheckboxInputProps) => {
    return (
        <div className={style.wrapper}>
            <input
                type="checkbox"
                id={id}
                className={style.input}
                checked={checked}
                onChange={(e) => onClick(e)}
            />
            <label htmlFor={id} className={style.label}>
                {label}
            </label>
        </div>
    );
};
