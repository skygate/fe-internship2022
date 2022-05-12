import { RenderInput } from "components";
import { Link } from "react-router-dom";
import styles from "./Login.module.scss";
import { LoginInputs } from "interfaces/index";
import React from "react";

interface LoginViewProps {
    onFormSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent) => void;
    inputsArray: LoginInputs[];
    errorMessage: string | null;
}

const url = "http://localhost:8000/user/logout";

export const LoginView = ({
    onFormSubmit,
    onInputChange,
    inputsArray,
    errorMessage,
}: LoginViewProps) => {
    const logoutUser = async (e: React.MouseEvent) => {
        e.preventDefault();

        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        return response.json();
    };

    return (
        <div className={styles.viewContainer}>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>Sign-In</h4>
                <form action="" className={styles.form} onSubmit={onFormSubmit}>
                    {inputsArray.map((item) => (
                        <RenderInput
                            key={item.id}
                            item={item}
                            onInputChange={onInputChange}
                            value={item.value}
                        />
                    ))}
                    {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
                    <button type="submit" className={styles.submitButton}>
                        Sign in
                    </button>
                </form>
            </div>
            <button onClick={logoutUser}>Log out</button>
            <div className={styles.createContainer}>
                <p className={styles.p}>New to SkyGate?</p>
                <Link to="/register">
                    <button className={styles.createButton}>Create your account</button>
                </Link>
            </div>
        </div>
    );
};
