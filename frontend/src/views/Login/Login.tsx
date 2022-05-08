import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.scss";
import { RenderInput } from "components";

interface User {
    username: string;
}

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

    const [loggedUser, setLoggedUser] = useState<User>();

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

    const postData = async (url: string) => {
        await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000/",
            },
            body: JSON.stringify(formState),
        })
            .then((res) => res.json())
            .then((data) => setLoggedUser(data));
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postData(LOGIN_URL);
        console.log(loggedUser);
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
                <Link to="/register">
                    <button className={styles.createButton}>Create your account</button>
                </Link>
            </div>
        </div>
    );
};
