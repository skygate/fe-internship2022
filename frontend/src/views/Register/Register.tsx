import React, { useState } from "react";
import { RegisterInputType, RegisterInputs } from "components/types/index";
import { RegisterView } from "./RegisterView";

interface FormState {
    email: string;
    username: string;
    password: string;
}

const REGISTER_URL = "http://localhost:8000/user/register";
const DEFAULT_STATE = {
    email: "",
    username: "",
    password: "",
};

export const Register = () => {
    const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);

    const inputsArray: RegisterInputs[] = [
        {
            name: RegisterInputType.Email,
            id: "email",
            label: "Email",
            placeholder: "Email",
            value: formState.email,
        },
        {
            name: RegisterInputType.Username,
            id: "username",
            label: "Username",
            placeholder: "Username",
            value: formState.username,
        },
        {
            name: RegisterInputType.Password,
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
        <RegisterView
            inputsArray={inputsArray}
            onInputChange={onInputChange}
            onFormSubmit={onFormSubmit}
        />
    );
};
