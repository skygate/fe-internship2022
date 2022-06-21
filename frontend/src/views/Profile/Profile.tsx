import styles from "./Profile.module.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProfileInfoPanel, Modal, LoadingToast, UpdateToast } from "components";
import imageIcon from "assets/imageIcon.svg";
import editIcon from "assets/editIcon.svg";
import { useAppSelector, useAppDispatch } from "store/store";
import { fetchUserProducts, UserProductsSelector } from "store/userProducts";
import { CreatedItems } from "./CreatedItems/CreatedItems";
import { getProfile, deleteProfile } from "API/UserService/profile";
import { ProfileAuctions } from "./ProfileAuctions/ProfileAuctions";
import { AuctionItem, ProfileInterface } from "interfaces";
import { getUsersAuctions } from "API/UserService/auctions";
import { UploadCoverPhotoModal, ConfirmModal, ProfileModal } from "components/Modal";
import { getProfilesForLoggedUser, UserProfilesSelector } from "store/profile";
import { ActiveProfileSelector, changeActiveProfile } from "store/activeProfile";
import { useNavigate } from "react-router-dom";
import { UserSelector } from "store/user";

const defaultCoverPicture =
    "https://galaktyczny.pl/wp-content/uploads/2021/08/windows-xp-wallpaper-tapeta.jpg";

const profileDisplayOptions = [
    { value: "onsale", label: "On Sale" },
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
    const user = useAppSelector(UserSelector);
    const activeProfile = useAppSelector(ActiveProfileSelector);
    const usersProducts = useAppSelector(UserProductsSelector);
    const userProfiles = useAppSelector(UserProfilesSelector);
    const navigate = useNavigate();
    const getProfileStates = async () => {
        if (!profileID) return;
        setProfile(await getProfile(profileID));
        setAuctions(await getUsersAuctions(profileID));
        dispatch(fetchUserProducts(profileID));
    };

    useEffect(() => {
        getProfileStates();
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
                        profileID={profileID || ""}
                    />
                );
            case "onsale":
                return <ProfileAuctions usersAuctions={auctions} />;

            case "likes":
                return (
                    <ProfileAuctions
                        usersAuctions={[...auctions].sort(
                            (a: AuctionItem, b: AuctionItem) => b.likes.length - a.likes.length
                        )}
                    />
                );
            case "following":
                return;
            case "followers":
                return;
        }
    };

    const handleDelete = () => {
        const deleteProfileToast = LoadingToast("Deleting profile...");
        if (profileID)
            deleteProfile(profileID)
                .then(() => {
                    UpdateToast(deleteProfileToast, "Profile deleted successfully", "success");
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
                    UpdateToast(deleteProfileToast, err.message, "error");
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
                {profile && (
                    <ProfileInfoPanel
                        profile={profile}
                        setProfile={async () =>
                            profileID && setProfile(await getProfile(profileID))
                        }
                    />
                )}
                <div className={styles.mainContent}>
                    {profileID === activeProfile.activeProfile?._id && user.userID ? (
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
                        updateView={getProfileStates}
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
                    <ConfirmModal functionToConfirm={handleDelete} />
                </Modal>
            )}
        </div>
    );
}
