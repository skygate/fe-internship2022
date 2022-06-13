import styles from "./ProfileModal.module.scss";
import { RenderInput } from "components";
import React, { useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { addProfile } from "API/UserService/addProfile";
import { editProfile } from "API/UserService/editProfile";
import { useAppDispatch } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";
import { inputsArray } from "./InputsArray";
import { ProfileModalProps } from "interfaces";
import { AxiosResponse } from "axios";
import { ProfilePicture } from "components";
import { uploadFile } from "API/UserService/uploadFile";
import { fileType, InputFileChange } from "interfaces/file";
import { LoadingToast, UpdateToast } from "components/ToastWrapper/Toasts";

export const ProfileModal = ({
    userID,
    isNew,
    profile,
    changeVisiblity,
    openConfirmModal,
}: ProfileModalProps) => {
    const [response, setResponse] = useState<string | null>(null);
    const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024;
    const defaultProfilePic =
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";
    const dispatch = useAppDispatch();

    const handleResponse = (data: AxiosResponse, errorText: string) => {
        setResponse(data.statusText);
        dispatch(getProfilesForLoggedUser(userID));
        if (data.statusText !== errorText) formik.resetForm();
    };

    const validationSchema = Yup.object().shape({
        profileName: Yup.string()
            .min(4, "Must be min 4 characters")
            .max(255, "You can use max 255 characters")
            .required("Required"),
        profilePicture: Yup.string().min(3, "Must be min 3 characters"),
        coverPicture: Yup.string().min(3, "Must be min 3 characters"),
        about: Yup.string().max(255, "You can use max 255 characters"),
        websiteUrl: Yup.string().max(255, "You can use max 255 characters"),
        facebookUrl: Yup.string().max(255, "You can use max 255 characters"),
        instagramUrl: Yup.string().max(255, "You can use max 255 characters"),
        twitterUrl: Yup.string().max(255, "You can use max 255 characters"),
    });

    const hideMessage = () => {
        setTimeout(() => {
            setResponse(null);
        }, 2000);
    };

    const defaultProfile = {
        profileName: "",
        profilePicture: defaultProfilePic,
        about: "",
        websiteUrl: "",
        instagramUrl: "",
        twitterUrl: "",
        facebookUrl: "",
    };

    const currentProfile = {
        profileName: profile?.profileName,
        profilePicture: profile?.profilePicture,
        about: profile?.about,
        websiteUrl: profile?.websiteUrl,
        instagramUrl: profile?.instagramUrl,
        twitterUrl: profile?.twitterUrl,
        facebookUrl: profile?.facebookUrl,
    };

    const init = isNew ? defaultProfile : currentProfile;

    const formik: FormikValues = useFormik({
        initialValues: init,
        validationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            setResponse(null);
            const updateProfile = !isNew
                ? LoadingToast("Updating profile...")
                : LoadingToast("Creating profile");
            if (isNew)
                await addProfile(values, userID)
                    .then(() => {
                        UpdateToast(updateProfile, "Profile created successfully", "success");
                        dispatch(getProfilesForLoggedUser(userID));
                    })
                    .catch(() => {
                        UpdateToast(updateProfile, "Something is wrong with form!", "error");
                    });
            if (!isNew)
                await editProfile(values, profile?._id)
                    .then(() => {
                        UpdateToast(updateProfile, "Profile updated successfully!", "success");
                        dispatch(getProfilesForLoggedUser(userID));
                    })
                    .catch(() => {
                        UpdateToast(updateProfile, "Something is wrong with form!", "error");
                    });
            hideMessage();
            changeVisiblity();
        },
    });

    const onImgSrcChange = (arg: InputFileChange) => {
        uploadProfilePhoto(arg.productFromData);
    };

    const onFileSelect = (file: File) => {
        const foundItem = fileType.find((item) => item.label === file.type);
        if (!foundItem) return;
        if (file.size > MAX_FILE_SIZE) return;
        const imageForm = new FormData();
        imageForm.append("file", file);
        onImgSrcChange({ productImageUrl: URL.createObjectURL(file), productFromData: imageForm });
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        file && onFileSelect(file);
    };

    const uploadProfilePhoto = async (file: FormData) => {
        const uploadCoverPhotoToast = LoadingToast("Uploading photo...");
        await uploadFile(file)
            .then((data) => {
                UpdateToast(uploadCoverPhotoToast, "Photo uploaded successfully", "success");
                formik.values.profilePicture = data.data.message;
            })
            .catch(() =>
                UpdateToast(uploadCoverPhotoToast, "Something is wrong with image!", "error")
            );
    };

    return (
        <form action="" className={styles.form} onSubmit={formik.handleSubmit} noValidate>
            <label htmlFor="fileInput" className={styles.uploadWrapper}>
                <input
                    type="file"
                    className={styles.fileInput}
                    id="fileInput"
                    accept=".png, .webp, .gif, .jpg, .jpeg"
                    onChange={onFileInputChange}
                />
                <ProfilePicture width={"120px"} url={formik.values.profilePicture} />
                <span>Upload new profile photo</span>
            </label>
            {inputsArray.map((item) => (
                <RenderInput
                    key={item.id}
                    item={item}
                    onInputChange={formik.handleChange}
                    value={formik.values[item.id]}
                    error={formik.errors[item.id]}
                />
            ))}
            <div className={styles.profileButtons}>
                {!isNew && (
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => {
                            changeVisiblity();
                            openConfirmModal && openConfirmModal();
                        }}
                    >
                        Delete
                    </button>
                )}
                <button type="submit" className={styles.submitButton}>
                    {isNew ? <span>Create new profile!</span> : <span>Update profile!</span>}
                </button>
            </div>
            {response && <span className={styles.response}>{response}</span>}
        </form>
    );
};
