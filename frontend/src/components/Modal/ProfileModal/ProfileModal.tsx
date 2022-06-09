import styles from "./ProfileModal.module.scss";
import { RenderInput } from "components";
import { useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { addProfile } from "API/UserService/addProfile";
import { editProfile } from "API/UserService/editProfile";
import { useAppDispatch } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";
import { inputsArray } from "./InputsArray";
import { ProfileModalProps } from "interfaces";
import { AxiosResponse } from "axios";
import { ProfilePicture } from "components/profilePicture/ProfilePicture";
import { uploadFile } from "API/UserService/uploadFile";
import { toast } from "react-toastify";
import { fileType, InputFileChange } from "interfaces/file";

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

    const init = isNew
        ? {
              profileName: "",
              profilePicture: defaultProfilePic,
              about: "",
              websiteUrl: "",
              instagramUrl: "",
              twitterUrl: "",
              facebookUrl: "",
          }
        : {
              profileName: profile?.profileName,
              profilePicture: profile?.profilePicture,
              about: profile?.about,
              websiteUrl: profile?.websiteUrl,
              instagramUrl: profile?.instagramUrl,
              twitterUrl: profile?.twitterUrl,
              facebookUrl: profile?.facebookUrl,
          };

    const formik: FormikValues = useFormik({
        initialValues: init,
        validationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            setResponse(null);
            const updateProfile = !isNew
                ? toast.loading("Updating profile...")
                : toast.loading("Creating profile...");
            isNew
                ? await addProfile(values, userID)
                      .then((data) => {
                          toast.update(updateProfile, {
                              render: "Profile created successfully!",
                              type: "success",
                              isLoading: false,
                              autoClose: 2500,
                              closeOnClick: true,
                          });
                          dispatch(getProfilesForLoggedUser(userID));
                      })
                      .catch((err) => {
                          toast.update(updateProfile, {
                              render: "Something is wrong with form!",
                              type: "error",
                              isLoading: false,
                              autoClose: 2500,
                              closeOnClick: true,
                          });
                      })
                : await editProfile(values, profile?._id)
                      .then((data) => {
                          toast.update(updateProfile, {
                              render: "Profile updated successfully!",
                              type: "success",
                              isLoading: false,
                              autoClose: 2500,
                              closeOnClick: true,
                          });
                          dispatch(getProfilesForLoggedUser(userID));
                      })
                      .catch((err) => {
                          toast.update(updateProfile, {
                              render: "Something is wrong with form!",
                              type: "error",
                              isLoading: false,
                              autoClose: 2500,
                              closeOnClick: true,
                          });
                      });
            hideMessage();
            changeVisiblity();
        },
    });

    const onImgSrcChange = (arg: InputFileChange) => {
        uploadProfilePhoto(arg.productFromData);
    };

    const onFileSelect = (file: any) => {
        const foundItem = fileType.find((item) => item.label === file.type);
        if (!foundItem) return;
        if (file.size > MAX_FILE_SIZE) return;
        const imageForm = new FormData();
        imageForm.append("file", file);
        onImgSrcChange({ productImageUrl: URL.createObjectURL(file), productFromData: imageForm });
    };

    const onFileInputChange = (e: any) => {
        const fil = e.target.files[0];
        onFileSelect(fil);
    };

    const uploadProfilePhoto = async (file: any) => {
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
        toast.update(uploadCoverPhotoToast, {
            render: "Photo uploaded successfully",
            type: "success",
            isLoading: false,
            autoClose: 2500,
            closeOnClick: true,
        });
        formik.values.profilePicture = uploadImage.data.message;
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
                {!isNew ? (
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
                ) : (
                    <></>
                )}
                <button type="submit" className={styles.submitButton}>
                    {isNew ? <span>Create new profile!</span> : <span>Update profile!</span>}
                </button>
            </div>
            {response ? <span className={styles.response}>{response}</span> : null}
        </form>
    );
};
