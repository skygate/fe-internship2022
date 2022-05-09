import React, { useState } from "react";
import { RegisterInputType, RegisterInputs } from "components/types/index";
import { RegisterView } from "./RegisterView";
import { registerUser } from "API";

interface FormState {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const REGISTER_URL = "http://localhost:8000/user/register";
const DEFAULT_STATE = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
};

export const Register = () => {
    const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);

    const inputsArray: RegisterInputs[] = [
        {
            name: RegisterInputType.Email,
            id: "email",
            label: "Email",
            placeholder: "Email",
            type: "email",
            required: true,
            minlength: 3,
            value: formState.email,
        },
        {
            name: RegisterInputType.Username,
            id: "username",
            label: "Username",
            placeholder: "Username",
            type: "text",
            required: true,
            minlength: 3,
            value: formState.username,
        },
        {
            name: RegisterInputType.Password,
            id: "password",
            label: "Password",
            placeholder: "Password",
            type: "password",
            required: true,
            minlength: 3,
            value: formState.password,
        },
        {
            name: RegisterInputType.ConfirmPassword,
            id: "confirmPassword",
            label: "Confirm password",
            placeholder: "Confirm password",
            type: "password",
            required: true,
            minlength: 3,
            value: formState.confirmPassword,
        },
    ];

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setFormState({ ...formState, [target.id]: target.value });
    };

    const checkPasswordMatch = (data: FormState) => {
        if (data.password !== data.confirmPassword) {
            alert("hasla nie sa takie same");
            return false;
        }
        return true;
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (checkPasswordMatch(formState)) return;
        registerUser(REGISTER_URL, formState);
    };

    return (
        <RegisterView
            inputsArray={inputsArray}
            onInputChange={onInputChange}
            onFormSubmit={onFormSubmit}
        />
    );
};
