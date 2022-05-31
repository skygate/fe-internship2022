import styles from "./Profile.module.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProfileInterface } from "../../interfaces/ProfileInterface";
import { ProfileInfoPanel } from "../../components";
import imageIcon from "../../assets/imageIcon.svg";
import editIcon from "../../assets/editIcon.svg";
import { useAppSelector, useAppDispatch } from "store/store";
import Modal from "components/Modal/Modal";
import { ProfileModal } from "../../components";
import { Product } from "interfaces/product";
import { getUsersProducts } from "API/UserService/getProducts";
import { CreatedItems } from "./CreatedItems/CreatedItems";
import { getProfile } from "API/UserService/profile";
import { ProfileAuctions } from "./ProfileAuctions/ProfileAuctions";
import { AuctionItem } from "interfaces";
import { getUsersAuctions } from "API/UserService/auctions";

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
    const user = useAppSelector((state) => state.user);
    const activeProfile = useAppSelector((state) => state.activeProfile);
    const [usersProducts, setUsersProducts] = useState<Product[]>([]);

    useEffect(() => {
        (async () => {
            if (!profileID) return;
            setProfile(await getProfile(profileID));
            setAuctions(await getUsersAuctions(profileID));
            setUsersProducts(await getUsersProducts(profileID));
        })();
    }, [profileID, activeProfile]);

    const profileDisplay = (displayOption: string) => {
        switch (displayOption) {
            case "created":
                return <CreatedItems usersProducts={usersProducts} />;
            case "onsale":
                return <ProfileAuctions usersAuctions={auctions} />;
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.coverPhotoWrapper}>
                <img className={styles.coverPhoto} alt="Cover" src={profile?.coverPicture} />
            </div>
            <div className={styles.contentContainer}>
                {profile && <ProfileInfoPanel profile={profile} />}
                <div className={styles.mainContent}>
                    {profileID === activeProfile.activeProfile?._id ? (
                        <div className={styles.settingsButtons}>
                            <button type="button" className={styles.buttonOnCoverPhoto}>
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
                        activeProfile={activeProfile.activeProfile}
                    />
                </Modal>
            )}
        </div>
    );
}
