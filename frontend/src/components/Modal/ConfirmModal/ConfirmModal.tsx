import React, { useState } from "react";
import styles from "./ConfirmModal.module.scss";
import { confirmUser } from "../../../API/UserService/confirmUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";
import { changeActiveProfile } from "store/activeProfile";

interface ConfirmModalProps {
    profileID: string | undefined;
    changeVisiblity: () => void;
    userID: string;
    functionToConfirm: () => void;
    toastName: string;
}

export const ConfirmModal = ({
    changeVisiblity,
    profileID,
    userID,
    functionToConfirm,
    toastName,
}: ConfirmModalProps) => {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(" ");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userProfiles = useAppSelector((state) => state.profiles.profiles);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await confirmUser(password)
            .then((data) => {
                if (data) functionToConfirm();
            })
            .catch((err) => {
                setErrorMessage("Password is incorrect");
                toast.error("Something gone wrong!", {
                    type: "error",
                    isLoading: false,
                    autoClose: 2500,
                    closeOnClick: true,
                });
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
                <button type="button" onClick={handleSubmit}>
                    Confirm
                </button>
            </div>
            <span className={styles.error}>{errorMessage}</span>
        </div>
    );
};
