import styles from "./Register.module.scss";
import { RenderInput } from "components";
import { RegisterInputs } from "components/types/index";
import React from "react";
import { FormikConfig, useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().min(3, "Username too short").required("required"),
    password: Yup.string().min(3, "Password too short").required("required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("required"),
});

interface initialValues {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface RegisterViewProps {
    inputsArray: RegisterInputs[];
    // formik: (FormikConfig<initialValues>):FormikProps<undefined>;
    formik: any;
}

export const RegisterView = ({ inputsArray, formik }: RegisterViewProps) => {
    return (
        <div className={styles.viewContainer}>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>Register</h4>

                <form action="" className={styles.form} onSubmit={formik.handleSubmit} noValidate>
                    {inputsArray.map((item) => (
                        <RenderInput
                            key={item.id}
                            item={item}
                            onInputChange={formik.handleChange}
                            value={formik.values[item.name]}
                            error={formik.errors[item.name]}
                        />
                    ))}
                    <button type="submit" className={styles.submitButton}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};
