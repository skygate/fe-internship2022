import React, { useState } from "react";
import { LoginView } from "./LoginView";
import { LoginInputs } from "components/types/index";
import { LoginInputType } from "components/types/index";

interface User {
    username: string;
}

interface FormState {
    email: string;
    password: string;
}

const LOGIN_URL = "http://localhost:8000/user/login";
const DEFAULT_STATE = {
    email: "",
    password: "",
};

export const Login = () => {
    const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);

    const [loggedUser, setLoggedUser] = useState<User>();

    const inputsArray: LoginInputs[] = [
        {
            name: LoginInputType.Email,
            id: "email",
            label: "Email",
            placeholder: "email",
            value: formState.email,
        },
        {
            name: LoginInputType.Password,
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
        <LoginView
            onFormSubmit={onFormSubmit}
            onInputChange={onInputChange}
            inputsArray={inputsArray}
        />
    );
};
