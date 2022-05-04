import React, { useContext } from "react";
import style from "./rowTextInputs.module.scss";
import { RenderTextInput } from "components";
import { createFormState } from "components/types/createFormState";
import { FormContext } from "views/CreateSingleCollectible/CreateSingleCollectible";

interface RowTextInputsProps {
    onInputChange: (e: React.ChangeEvent) => void;
}

enum TextInputTypeNarrow {
    Size,
    Properties,
}

interface TextInputNarrow {
    name: TextInputTypeNarrow;
    id: string;
    label: string;
    placeholder: string;
    value: string;
}

//docelowo wczytać z bazy danych
const categoryOptions = ["PNG", "GIF", "WEBP", "MP4", "MP3"];

export const RowTextInputs = ({ onInputChange }: RowTextInputsProps) => {
    const formState: createFormState = useContext(FormContext);

    const textInputNarrowArray: TextInputNarrow[] = [
        {
            name: TextInputTypeNarrow.Size,
            id: "productSize",
            label: "SIZE",
            placeholder: "e.g. Size",
            value: formState.productSize,
        },
        {
            name: TextInputTypeNarrow.Properties,
            id: "productProperties",
            label: "PROPERTIES",
            placeholder: "e.g. Properties",
            value: formState.productProperties,
        },
    ];
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
            {textInputNarrowArray.map((item) => {
                return (
                    <RenderTextInput
                        key={item.id}
                        item={item}
                        onInputChange={onInputChange}
                        width={"190px"}
                        value={item.value}
                    />
                );
            })}
        </div>
    );
};
