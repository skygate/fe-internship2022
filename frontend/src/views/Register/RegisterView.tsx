import styles from "./Register.module.scss";
import { RenderInput } from "components";
import { RegisterInputs } from "interfaces/index";
import { FormikValues } from "formik";

interface RegisterViewProps {
    inputsArray: RegisterInputs[];
    formik: FormikValues;
    response: string | null;
}

export const RegisterView = ({ inputsArray, formik, response }: RegisterViewProps) => {
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
                    {response ? <span className={styles.response}>{response}</span> : null}
                </form>
            </div>
        </div>
    );
};
