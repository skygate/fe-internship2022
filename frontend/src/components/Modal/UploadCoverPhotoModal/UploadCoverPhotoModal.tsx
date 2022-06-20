import { ProfileInterface } from "interfaces";
import { useState } from "react";
import { UploadFile } from "components";
import { InputFileChange } from "interfaces/file";
import { editProfile } from "API/UserService/editProfile";
import { uploadFile } from "API/UserService/uploadFile";
import styles from "./UploadCoverPhotoModal.module.scss";
import { ErrorToast, LoadingToast, UpdateToast } from "components/ToastWrapper/Toasts";

interface UploadCoverPhoto {
    profile: ProfileInterface | null;
    changeVisiblity: () => void;
    setProfile: () => void;
}

export const UploadCoverPhotoModal = ({
    profile,
    changeVisiblity,
    setProfile,
}: UploadCoverPhoto) => {
    const [file, setFile] = useState<FormData>(new FormData());
    const [formState, setFormState] = useState({
        imageUrl: profile?.coverPicture,
        formData: new FormData(),
    });

    const onFormSubmit = async () => {
        if (!formState.formData || !formState.imageUrl)
            return ErrorToast("Something is wrong with image...");
        const uploadCoverPhotoToast = LoadingToast("Uploading photo...");
        const uploadImage = await uploadFile(file).catch(() =>
            UpdateToast(uploadCoverPhotoToast, "Something is wrong with image!", "error")
        );
        if (!uploadImage) return null;
        const newCoverPhoto = uploadImage.data.message;
        await editProfile({ coverPicture: newCoverPhoto }, profile?._id)
            .then(() => {
                UpdateToast(uploadCoverPhotoToast, "Cover photo is up to date", "success");
                setFormState({ ...formState, imageUrl: profile?.coverPicture });
                setProfile();
                changeVisiblity();
            })
            .catch(() => UpdateToast(uploadCoverPhotoToast, "Something went wrong", "error"));
    };

    const onImgSrcChange = (arg: InputFileChange) => {
        setFormState({
            ...formState,
            imageUrl: arg.productImageUrl,
            formData: arg.productFromData,
        });
        setFile(arg.productFromData);
    };

    return (
        <div>
            <UploadFile onImgSrcChange={onImgSrcChange} />
            <div className={styles.coverPhotoWrapper}>
                <img className={styles.coverPhoto} src={formState.imageUrl} />
            </div>
            <div className={styles.buttonWrapper}>
                <button type="button" className={styles.updateButton} onClick={onFormSubmit}>
                    Update photo!
                </button>
            </div>
        </div>
    );
};
