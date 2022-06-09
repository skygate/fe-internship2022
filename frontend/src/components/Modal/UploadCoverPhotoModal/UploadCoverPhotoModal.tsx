import { ProfileInterface } from "interfaces";
import { useState } from "react";
import { UploadFile } from "components";
import { InputFileChange } from "interfaces/file";
import { toast } from "react-toastify";
import { editProfile } from "API/UserService/editProfile";
import { uploadFile } from "API/UserService/uploadFile";
import styles from "./UploadCoverPhotoModal.module.scss";

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
        if (formState.formData === undefined || formState.imageUrl === "")
            return toast.error("Something is wrong with image...", { autoClose: 2500 });
        const uploadCoverPhotoToast = toast.loading("Uploading photo...");
        const uploadImage = await uploadFile(file).catch(() =>
            toast.update(uploadCoverPhotoToast, {
                render: "Something is wrong with image!",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            })
        );
        if (!uploadImage) return null;
        const newCoverPhoto = uploadImage.data.message;
        await editProfile({ coverPicture: newCoverPhoto }, profile?._id)
            .then(() => {
                toast.update(uploadCoverPhotoToast, {
                    render: "Cover photo is up to date",
                    type: "success",
                    isLoading: false,
                    autoClose: 2500,
                    closeOnClick: true,
                });
                setFormState({ ...formState, imageUrl: profile?.coverPicture });
                setProfile();
                changeVisiblity();
            })
            .catch(() =>
                toast.update(uploadCoverPhotoToast, {
                    render: "Something went wrong",
                    type: "error",
                    isLoading: false,
                    autoClose: 2500,
                    closeOnClick: true,
                })
            );
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
