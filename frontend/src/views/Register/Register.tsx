import React, { useState } from "react";
import { RegisterInputType, RegisterInputs } from "interfaces/index";
import { RegisterView } from "./RegisterView";
import { registerUser } from "API/UserService";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { yupRegisterPasswordValidation } from "components/passwordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import { LoadingToast, UpdateToast } from "components";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().min(3, "Must be min 3 characters").required("Required"),
    password: yupRegisterPasswordValidation,
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
});

export const Register = () => {
    const [response, setResponse] = useState<string | null>(null);
    const navigate = useNavigate();
    const hideMessage = () => {
        setTimeout(() => {
            setResponse(null);
        }, 2000);
    };

    const formik: FormikValues = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            setResponse(null);
            const data = {
                ...values,
                email: values.email.toLowerCase(),
            };
            await registerUser(data).then((data) => {
                const registerToast = LoadingToast("Registering...");
                setResponse(data.message);
                if (data.message === "User added succesfully") {
                    formik.resetForm();
                    UpdateToast(registerToast, "Account registered successfully!", "success");
                    navigate("/");
                }
            });
            hideMessage();
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

    return <RegisterView inputsArray={inputsArray} formik={formik} response={response} />;
};
