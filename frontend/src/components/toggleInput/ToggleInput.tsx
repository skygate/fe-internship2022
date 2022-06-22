import React from "react";
import style from "./toggleInput.module.scss";

interface ToggleInputProps {
    id: string;
    label: string;
    info?: string;
    onChange: (e: React.ChangeEvent) => void;
    checked: boolean;
}

export const ToggleInput = ({ id, label, info, onChange, checked }: ToggleInputProps) => {
    return (
        <div>
            <div className={style.toggleSwitchInput}>
                <div>
                    <p className={style.switchName}>{label}</p>
                    <p className={style.switchInfo}>{info}</p>
                </div>

                <div className={style.toggleSwitch}>
                    <label className={style.switch}>
                        <input type="checkbox" onChange={onChange} id={id} checked={checked} />
                        <span className={style.toggle}></span>
                    </label>
                </div>
            </div>
        </div>
    );
};
