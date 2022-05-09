import React, { useState } from "react";
import { LoginView } from "./LoginView";
import { LoginInputs } from "components/types/index";
import { LoginInputType } from "components/types/index";
import { loginUser } from "API";

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
            type: "email",
            required: true,
            minlength: 3,
            value: formState.email,
        },
        {
            name: LoginInputType.Password,
            id: "password",
            label: "Password",
            placeholder: "Password",
            type: "password",
            required: true,
            minlength: 3,
            value: formState.password,
        },
    ];

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setFormState({ ...formState, [target.id]: target.value });
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginUser(LOGIN_URL, formState).then((data) => setLoggedUser(data));
    };

    return (
        <LoginView
            onFormSubmit={onFormSubmit}
            onInputChange={onInputChange}
            inputsArray={inputsArray}
        />
    );
};
