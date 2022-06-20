import { useState } from "react";
import styles from "./ConfirmModal.module.scss";
import { confirmUser } from "API/UserService/confirmUser";
import { ErrorToast } from "components";

interface ConfirmModalProps {
    functionToConfirm: () => void;
}

export const ConfirmModal = ({ functionToConfirm }: ConfirmModalProps) => {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        await confirmUser(password)
            .then((data) => {
                if (data) functionToConfirm();
            })
            .catch(() => {
                setErrorMessage("Password is incorrect");
                ErrorToast("Password is incorrect");
            });
    };
    return (
        <div>
            <div>
                <input
                    className={styles.passwordInput}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Confirm
                </button>
            </div>
            <span className={styles.error}>{errorMessage}</span>
        </div>
    );
};
