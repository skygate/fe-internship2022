import React, { useState } from "react";
import { LoginView } from "./LoginView";
import { LoginInputs } from "components/types/index";
import { LoginInputType } from "components/types/index";
import { loginUser } from "API/UserService";
import { User } from "components/types";

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
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState(null);

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

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loggedUser) return;
        try {
            loginUser(LOGIN_URL, formState).then((data) => {
                if (data.hasOwnProperty("message")) {
                    setErrorMessage(data.message);
                    setFormState(DEFAULT_STATE);
                    return;
                }
                setLoggedUser(data);
                setFormState(DEFAULT_STATE);
            });
        } catch (error) {
            throw new Error("Couldn't login user");
        }
    };

    return (
        <LoginView
            onFormSubmit={onFormSubmit}
            onInputChange={onInputChange}
            inputsArray={inputsArray}
            errorMessage={errorMessage}
            loggedUser={loggedUser}
        />
    );
};
