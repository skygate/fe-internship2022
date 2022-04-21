import React from "react";
import style from "./rowTextInputs.module.scss";
import { RenderTextInput } from "components";

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
}

const textInputNarrowArray: TextInputNarrow[] = [
    {
        name: TextInputTypeNarrow.Size,
        id: "itemSize",
        label: "SIZE",
        placeholder: "e.g. Size",
    },
    {
        name: TextInputTypeNarrow.Properties,
        id: "itemProperties",
        label: "PROPERTIES",
        placeholder: "e.g. Properties",
    },
];

const royalityOptions: string[] = [];

const createOptions = () => {
    for (let i = 1; i <= 10; i++) {
        royalityOptions.push(`${i * 10}%`);
    }
};

createOptions();

export const RowTextInputs = ({ onInputChange }: RowTextInputsProps) => {
    return (
        <div className={style.row}>
            <div className={style.selectContainer}>
                <label htmlFor="itemRoyality" className={style.label}>
                    ROYALITY
                </label>
                <select
                    name="itemRoyality"
                    id="itemRoyality"
                    onChange={onInputChange}
                    className={style.select}
                >
                    {royalityOptions.map((item) => {
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
                    />
                );
            })}
        </div>
    );
};
