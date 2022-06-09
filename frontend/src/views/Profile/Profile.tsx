import styles from "./Profile.module.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProfileInterface } from "../../interfaces/ProfileInterface";
import { ProfileInfoPanel } from "../../components";
import imageIcon from "../../assets/imageIcon.svg";
import editIcon from "../../assets/editIcon.svg";
import { useAppSelector, useAppDispatch } from "store/store";
import { Modal } from "components";
import { ProfileModal } from "../../components";
import { fetchUserProducts } from "store/userProducts";
import { CreatedItems } from "./CreatedItems/CreatedItems";
import { getProfile } from "API/UserService/profile";
import { ProfileAuctions } from "./ProfileAuctions/ProfileAuctions";
import { AuctionItem } from "interfaces";
import { getUsersAuctions } from "API/UserService/auctions";
import { UploadCoverPhotoModal } from "components/Modal/UploadCoverPhotoModal/UploadCoverPhotoModal";
import { ConfirmModal } from "components/Modal/ConfirmModal/ConfirmModal";
import { deleteProfile } from "../../API/UserService/profile";
import { getProfilesForLoggedUser } from "store/profile";
import { changeActiveProfile } from "store/activeProfile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const defaultCoverPicture =
    "https://galaktyczny.pl/wp-content/uploads/2021/08/windows-xp-wallpaper-tapeta.jpg";

const profileDisplayOptions = [
    { value: "onsale", label: "On Sale" },
    { value: "collectibles", label: "Collectibles" },
    { value: "created", label: "Created" },
    { value: "likes", label: "Likes" },
    { value: "following", label: "Following" },
    { value: "followers", label: "Followers" },
];

export function Profile() {
    const { profileID } = useParams();
    const dispatch = useAppDispatch();
    const [profile, setProfile] = useState<ProfileInterface | null>(null);
    const [auctions, setAuctions] = useState<AuctionItem[]>([]);
    const [selectedProfileDisplay, setSelectedProfileDisplay] = useState<string>("onsale");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploadCoverPhotoModalVisible, setIsUploadCoverPhotoModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const user = useAppSelector((state) => state.user);
    const activeProfile = useAppSelector((state) => state.activeProfile);
    const usersProducts = useAppSelector((state) => state.userProducts.products);
    const userProfiles = useAppSelector((state) => state.profiles.profiles);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (!profileID) return;
            setProfile(await getProfile(profileID));
            setAuctions(await getUsersAuctions(profileID));
            dispatch(fetchUserProducts(profileID));
        })();
    }, [profileID]);

    const profileDisplay = (displayOption: string) => {
        switch (displayOption) {
            case "created":
                return (
                    <CreatedItems
                        usersProducts={usersProducts}
                        setAuctions={async () =>
                            profileID && setAuctions(await getUsersAuctions(profileID))
                        }
                        profileID={profileID ? profileID : ""}
                    />
                );
            case "onsale":
                return <ProfileAuctions usersAuctions={auctions} />;
        }
    };

    const handleDelete = () => {
        const deleteProfileToast = toast.loading("Deleting profile...");
        if (profileID)
            deleteProfile(profileID)
                .then(() => {
                    toast.update(deleteProfileToast, {
                        render: "Profile deleted successfully",
                        type: "success",
                        isLoading: false,
                        autoClose: 2500,
                        closeOnClick: true,
                    });
                    localStorage.setItem("activeAccount", JSON.stringify(""));
                    dispatch(getProfilesForLoggedUser(user.userID));
                    dispatch(
                        changeActiveProfile({
                            profiles: userProfiles,
                            isAuto: true,
                        })
                    );
                    navigate("/");
                    setIsConfirmModalVisible(false);
                })
                .catch((err: Error) => {
                    toast.update(deleteProfileToast, {
                        render: err.message,
                        type: "error",
                        isLoading: false,
                        autoClose: 2500,
                        closeOnClick: true,
                    });
                });
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.coverPhotoWrapper}>
                <img
                    className={styles.coverPhoto}
                    alt="Cover"
                    src={profile?.coverPicture ? profile.coverPicture : defaultCoverPicture}
                />
            </div>
            <div className={styles.contentContainer}>
                {profile && <ProfileInfoPanel profile={profile} />}
                <div className={styles.mainContent}>
                    {profileID === activeProfile.activeProfile?._id && user.userID !== "" ? (
                        <div className={styles.settingsButtons}>
                            <button
                                type="button"
                                className={styles.buttonOnCoverPhoto}
                                onClick={() => setIsUploadCoverPhotoModalVisible(true)}
                            >
                                Edit cover photo
                                <img
                                    className={styles.buttonIcon}
                                    src={imageIcon}
                                    aria-hidden="true"
                                    alt="editCoverPhoto"
                                />
                            </button>
                            <button
                                type="button"
                                className={styles.buttonOnCoverPhoto}
                                onClick={() => {
                                    setIsModalVisible(true);
                                }}
                            >
                                Edit profile
                                <img
                                    className={styles.buttonIcon}
                                    src={editIcon}
                                    aria-hidden="true"
                                    alt="editProfile"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.settingsButtons}></div>
                    )}
                    <div className={styles.profileDisplayOptions}>
                        {profileDisplayOptions.map((opt, index) => (
                            <label
                                key={index}
                                className={
                                    selectedProfileDisplay === opt.value
                                        ? styles.selectedProfileDisplayLabel
                                        : styles.profileDisplayLabel
                                }
                            >
                                <input
                                    name="cat"
                                    type="radio"
                                    value={opt.value}
                                    className={styles.profileDisplayRadio}
                                    checked={opt.value === selectedProfileDisplay}
                                    onChange={() => setSelectedProfileDisplay(opt.value)}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                    {profileDisplay(selectedProfileDisplay)}
                </div>
            </div>
            {isModalVisible && (
                <Modal
                    visible={isModalVisible}
                    onClose={() => {
                        setIsModalVisible(false);
                    }}
                    title="Edit profile"
                >
                    <ProfileModal
                        isNew={false}
                        userID={user.userID}
                        profile={activeProfile.activeProfile}
                        changeVisiblity={() => setIsModalVisible(false)}
                        openConfirmModal={() => setIsConfirmModalVisible(true)}
                    />
                </Modal>
            )}
            {isUploadCoverPhotoModalVisible && (
                <Modal
                    visible={isUploadCoverPhotoModalVisible}
                    onClose={() => {
                        setIsUploadCoverPhotoModalVisible(false);
                    }}
                    title="Upload new cover photo!"
                >
                    <UploadCoverPhotoModal
                        profile={profile}
                        changeVisiblity={() => setIsUploadCoverPhotoModalVisible(false)}
                        setProfile={async () =>
                            profileID && setProfile(await getProfile(profileID))
                        }
                    />
                </Modal>
            )}
            {isConfirmModalVisible && (
                <Modal
                    visible={isConfirmModalVisible}
                    onClose={() => {
                        setIsConfirmModalVisible(false);
                    }}
                    title="Confirm profile delete"
                    description="Enter your account password"
                >
                    <ConfirmModal
                        changeVisiblity={() => setIsConfirmModalVisible(false)}
                        functionToConfirm={handleDelete}
                        profileID={profileID}
                        userID={user.userID}
                        toastName={"deleteProfileToast"}
                    />
                </Modal>
            )}
        </div>
    );
}
