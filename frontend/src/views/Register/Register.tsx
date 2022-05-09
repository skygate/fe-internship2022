import React, { useState } from "react";
import { RegisterInputType, RegisterInputs } from "components/types/index";
import { RegisterView } from "./RegisterView";
import { registerUser } from "API";
import { FormikConfig, useFormik } from "formik";
import * as Yup from "yup";
import { yupRegisterPasswordValidation } from "components/passwordInput/PasswordInput";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().min(3, "Must be min 3 characters").required("Required"),
    password: yupRegisterPasswordValidation,
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
});

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

    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            registerUser(REGISTER_URL, values);
            console.log(values);
        },
    });

    const inputsArray: RegisterInputs[] = [
        {
            name: RegisterInputType.Email,
            id: "email",
            label: "Email",
            placeholder: "Email",
            type: "email",
        },
        {
            name: RegisterInputType.Username,
            id: "username",
            label: "Username",
            placeholder: "Username",
            type: "text",
        },
        {
            name: RegisterInputType.Password,
            id: "password",
            label: "Password",
            placeholder: "Password",
            type: "password",
        },
        {
            name: RegisterInputType.ConfirmPassword,
            id: "confirmPassword",
            label: "Confirm password",
            placeholder: "Confirm password",
            type: "password",
        },
    ];

    return <RegisterView inputsArray={inputsArray} formik={formik} />;
};
