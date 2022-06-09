import React from "react";
import style from "./rowTextInputs.module.scss";

interface RowTextInputsProps {
    onInputChange: (e: React.ChangeEvent) => void;
}

//docelowo wczytać z bazy danych
const categoryOptions = ["PNG", "GIF", "WEBP", "MP4", "MP3"];

export const RowTextInputs = ({ onInputChange }: RowTextInputsProps) => {
    return (
        <div className={style.row}>
            <div className={style.selectContainer}>
                <label htmlFor="itemRoyality" className={style.label}>
                    CATEGORY
                </label>
                <select
                    name="productCategory"
                    id="productCategory"
                    onChange={onInputChange}
                    className={style.select}
                >
                    {categoryOptions.map((item) => {
                        return (
                            <option value={item} key={item} className={style.option}>
                                {item}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};
