import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.scss";
import { RenderInput } from "components";

enum InputType {
    Email,
    Username,
    Password,
}

interface Inputs {
    name: InputType;
    id: string;
    label: string;
    placeholder: string;
    value: string;
}

interface FormState {
    email: string;
    username: string;
    password: string;
}

const REGISTER_URL = "http://localhost:8000/user/register";

export const Register = () => {
    const [formState, setFormState] = useState<FormState>({
        email: "",
        username: "",
        password: "",
    });

    const inputsArray: Inputs[] = [
        {
            name: InputType.Email,
            id: "email",
            label: "Email",
            placeholder: "Email",
            value: formState.email,
        },
        {
            name: InputType.Username,
            id: "username",
            label: "Username",
            placeholder: "Username",
            value: formState.username,
        },
        {
            name: InputType.Password,
            id: "password",
            label: "Password",
            placeholder: "Password",
            value: formState.password,
        },
    ];

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setFormState({ ...formState, [target.id]: target.value });
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const postData = async (url: string) => {
            await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
        };

        postData(REGISTER_URL);
    };

    return (
        <div className={styles.viewContainer}>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>Register</h4>
                <form action="" className={styles.form} onSubmit={onFormSubmit}>
                    {inputsArray.map((item) => {
                        return (
                            <RenderInput
                                key={item.id}
                                item={item}
                                onInputChange={onInputChange}
                                value={item.value}
                            />
                        );
                    })}
                    <button type="submit" className={styles.submitButton}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};
