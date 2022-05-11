import { RenderInput } from "components";
import { Link } from "react-router-dom";
import styles from "./Login.module.scss";
import { LoginInputs } from "interfaces/index";
import { User } from "interfaces";

interface LoginViewProps {
    onFormSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent) => void;
    inputsArray: LoginInputs[];
    errorMessage: string | null;
    loggedUser: User | null;
}

export const LoginView = ({
    onFormSubmit,
    onInputChange,
    inputsArray,
    errorMessage,
    loggedUser,
}: LoginViewProps) => {
    return (
        <div className={styles.viewContainer}>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>Sign-In</h4>
                <form action="" className={styles.form} onSubmit={onFormSubmit}>
                    {inputsArray.map((item) => (
                        <RenderInput
                            key={item.id}
                            item={item}
                            onInputChange={onInputChange}
                            value={item.value}
                        />
                    ))}
                    {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
                    {loggedUser ? (
                        <p className={styles.user}>Hello, {loggedUser.username}</p>
                    ) : null}
                    <button type="submit" className={styles.submitButton}>
                        Sign in
                    </button>
                </form>
            </div>
            <div className={styles.createContainer}>
                <p className={styles.p}>New to SkyGate?</p>
                <Link to="/register">
                    <button className={styles.createButton}>Create your account</button>
                </Link>
            </div>
        </div>
    );
};
