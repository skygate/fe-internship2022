import React from "react";
import style from "./renderInput.module.scss";

interface ObjectType {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    minlength?: number;
}

interface RenderInputProps {
    item: ObjectType;
    onInputChange: (e: React.ChangeEvent) => void;
    width?: string;
    value: string | number;
    error?: string;
}

export const RenderInput = ({ item, onInputChange, width, value, error }: RenderInputProps) => {
    const onClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLInputElement;
        if (target.value === "0") target.value = "";
    };

    return (
        <div className={style.inputContainer} key={item.id} style={{ width: `${width}` }}>
            <label htmlFor={item.id} className={style.label}>
                {item.label}
            </label>
            <input
                type={item.type || "text"}
                placeholder={item.placeholder}
                id={item.id}
                className={style.input}
                onChange={onInputChange}
                value={value}
                required={item.required}
                minLength={item.minlength}
                onClick={(e) => onClick(e)}
            />
            {error ? <p className={style.error}>{error}</p> : null}
        </div>
    );
};
