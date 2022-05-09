import styles from "./Register.module.scss";
import { RenderInput } from "components";
import { RegisterInputs } from "components/types/index";
import React from "react";

interface RegisterViewProps {
    inputsArray: RegisterInputs[];
    onInputChange: (e: React.ChangeEvent) => void;
    onFormSubmit: (e: React.FormEvent) => void;
}

export const RegisterView = ({ inputsArray, onInputChange, onFormSubmit }: RegisterViewProps) => {
    return (
        <div className={styles.viewContainer}>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>Register</h4>
                <form action="" className={styles.form} onSubmit={onFormSubmit}>
                    {inputsArray.map((item) => (
                        <RenderInput
                            key={item.id}
                            item={item}
                            onInputChange={onInputChange}
                            value={item.value}
                        />
                    ))}
                    <button type="submit" className={styles.submitButton}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};
