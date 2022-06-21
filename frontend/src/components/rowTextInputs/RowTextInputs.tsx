import React, { useEffect, useState } from "react";
import style from "./rowTextInputs.module.scss";
import { getAllCategories } from "API/UserService/categories";
import { Category } from "interfaces";
interface RowTextInputsProps {
    onInputChange: (e: React.ChangeEvent) => void;
}

//docelowo wczytać z bazy danych
const categoryOptions = ["PNG", "GIF", "WEBP", "MP4", "MP3"];

export const RowTextInputs = ({ onInputChange }: RowTextInputsProps) => {
    const [categories, setCategories] = useState<Category[]>();
    useEffect(() => {
        getAllCategories().then((res) => setCategories(res));
    }, []);

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
                    {categories &&
                        categories.map((item) => (
                            <option
                                value={item.id}
                                key={item.categoryName}
                                className={style.option}
                            >
                                {item.categoryName}
                            </option>
                        ))}
                </select>
            </div>
        </div>
    );
};
