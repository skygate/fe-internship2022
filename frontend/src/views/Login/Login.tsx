import React, { useState } from "react";
import { LoginView } from "./LoginView";
import { LoginInputs } from "interfaces/index";
import { LoginInputType } from "interfaces/index";
import { loginUser, logoutUser } from "API/UserService";
import { useAppDispatch } from "store/store";
import { setUser } from "store/user";

interface FormState {
    email: string;
    password: string;
}

const DEFAULT_STATE = {
    email: "",
    password: "",
};

export const Login = () => {
    const dispatch = useAppDispatch();
    const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);
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

        loginUser(formState).then((data) => {
            if (data.data.hasOwnProperty("message")) {
                setErrorMessage(data.data.message);
                setFormState(DEFAULT_STATE);
                return;
            }
            setFormState(DEFAULT_STATE);
            dispatch(setUser());
        });
    };

    const onLogoutUser = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logoutUser();
        dispatch(setUser());
    };

    return (
        <LoginView
            onFormSubmit={onFormSubmit}
            onInputChange={onInputChange}
            inputsArray={inputsArray}
            errorMessage={errorMessage}
            logoutUser={onLogoutUser}
        />
    );
};
