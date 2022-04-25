import React from "react";
import style from "./renderTextInput.module.scss";

interface ObjectType {
    id: string;
    label: string;
    placeholder: string;
}

interface RenderTextInputProps {
    item: ObjectType;
    onInputChange: (e: React.ChangeEvent) => void;
    width?: string;
}

export const RenderTextInput = ({ item, onInputChange, width }: RenderTextInputProps) => {
    return (
        <div className={style.inputContainer} key={item.id} style={{ width: `${width}` }}>
            <label htmlFor={item.id} className={style.label}>
                {item.label}
            </label>
            <input
                type="text"
                placeholder={item.placeholder}
                id={item.id}
                className={style.input}
                onChange={onInputChange}
            />
        </div>
    );
};
