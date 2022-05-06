import styles from "./Login.module.scss";
import { RenderInput } from "components";
import React, { useState } from "react";

enum InputType {
    Email,
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
    password: string;
}

const LOGIN_URL = "http://localhost:8000/user/login";

export const Login = () => {
    const [formState, setFormState] = useState<FormState>({
        email: "",
        password: "",
    });

    const inputsArray: Inputs[] = [
        {
            name: InputType.Email,
            id: "email",
            label: "Email",
            placeholder: "email",
            value: formState.email,
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

        postData(LOGIN_URL);
    };

    return (
        <div className={styles.viewContainer}>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>Sign-In</h4>
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
                        Sign in
                    </button>
                </form>
            </div>
            <div className={styles.createContainer}>
                <p className={styles.p}>New to SkyGate?</p>
                <button className={styles.createButton}>Create your account</button>
            </div>
        </div>
    );
};
