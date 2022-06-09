import React from "react";
import style from "./selectInput.module.scss";

interface SelectInputProps {
    label: string;
    onChange: () => void;
    value: string;
    id: string;
}

const categoryOptions = ["PNG", "GIF", "WEBP", "MP4", "MP3"];

export const SelectInput = ({ label, onChange, value, id }: SelectInputProps) => {
    return (
        <div className={style.selectContainer}>
            <label className={style.label}>{label}</label>
            <select name={id} onChange={onChange} className={style.select} value={value}>
                {categoryOptions.map((item) => {
                    return (
                        <option value={item} key={item} className={style.option}>
                            {item}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
