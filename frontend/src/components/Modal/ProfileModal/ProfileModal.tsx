import styles from "./ProfileModal.module.scss";
import { ProfileInputs, ProfileInterface } from "interfaces";
import { ProfileInputType } from "interfaces";
import { RenderInput } from "components";
import { useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { addProfile } from "API/UserService/addProfile";
import { editProfile } from "API/UserService/editProfile";
import { useAppDispatch } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";

export interface ProfileModalProps {
    userID: string;
    isNew: boolean;
    activeProfile?: ProfileInterface | null;
}

export const ProfileModal = ({ userID, isNew, activeProfile }: ProfileModalProps) => {
    const dispatch = useAppDispatch();

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
    const inputsArray: ProfileInputs[] = [
        {
            name: ProfileInputType.ProfileName,
            id: "profileName",
            label: "Profile name",
            placeholder: "Profile name",
            type: "text",
        },
        {
            name: ProfileInputType.ProfilePicture,
            id: "profilePicture",
            label: "Profile picture",
            placeholder: "Profile picture URL",
            type: "text",
        },
        {
            name: ProfileInputType.CoverPicture,
            id: "coverPicture",
            label: "Cover picture",
            placeholder: "Cover picture URL",
            type: "text",
        },
        {
            name: ProfileInputType.About,
            id: "about",
            label: "About",
            placeholder: "Tell something about you",
            type: "text",
        },
        {
            name: ProfileInputType.WebsiteUrl,
            id: "websiteUrl",
            label: "Website address",
            placeholder: "Website URL",
            type: "text",
        },
        {
            name: ProfileInputType.FacebookUrl,
            id: "facebookUrl",
            label: "Facebook profile",
            placeholder: "Facebook profile URL",
            type: "text",
        },
        {
            name: ProfileInputType.InstagramUrl,
            id: "instagramUrl",
            label: "Instagram profile",
            placeholder: "Instagram profile URL",
            type: "text",
        },
        {
            name: ProfileInputType.TwitterUrl,
            id: "twitterUrl",
            label: "Twitter profile",
            placeholder: "Twitter profile URL",
            type: "text",
        },
    ];

    const [response, setResponse] = useState<string | null>(null);

    const hideMessage = () => {
        setTimeout(() => {
            setResponse(null);
        }, 2000);
    };
    const init = isNew
        ? {
              profileName: "",
              profilePicture: "",
              coverPicture: "",
              about: "",
              websiteUrl: "",
              instagramUrl: "",
              twitterUrl: "",
              facebookUrl: "",
          }
        : {
              profileName: activeProfile?.profileName,
              profilePicture: activeProfile?.profilePicture,
              coverPicture: activeProfile?.coverPicture,
              about: activeProfile?.about,
              websiteUrl: activeProfile?.websiteUrl,
              instagramUrl: activeProfile?.instagramUrl,
              twitterUrl: activeProfile?.twitterUrl,
              facebookUrl: activeProfile?.facebookUrl,
          };
    const formik: FormikValues = useFormik({
        initialValues: init,
        validationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            setResponse(null);
            isNew
                ? await addProfile(values, userID).then((data) => {
                      setResponse(data.statusText);
                      dispatch(getProfilesForLoggedUser(userID));
                      if (data.statusText !== "Failed") formik.resetForm();
                  })
                : await editProfile(values, activeProfile?._id).then((data) => {
                      setResponse(data.statusText);
                      dispatch(getProfilesForLoggedUser(userID));
                      if (data.statusText !== "Failed") formik.resetForm();
                  });
            hideMessage();
        },
    });

    return (
        <form action="" className={styles.form} onSubmit={formik.handleSubmit} noValidate>
            {inputsArray.map((item) => (
                <RenderInput
                    key={item.id}
                    item={item}
                    onInputChange={formik.handleChange}
                    value={formik.values[item.id]}
                    error={formik.errors[item.id]}
                />
            ))}
            <button type="submit" className={styles.submitButton}>
                {isNew ? <span>Create new profile!</span> : <span>Update profile!</span>}
            </button>
            {response ? <span className={styles.response}>{response}</span> : null}
        </form>
    );
};
