import styles from "./Profile.module.scss";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ProfileInterface } from "../../interfaces/ProfileInterface";
import { AuctionWithProductInfo } from "../../interfaces/AuctionWithProductInfo";
import { ProfileInfoPanel } from "../../components";
import imageIcon from "../../assets/imageIcon.svg";
import editIcon from "../../assets/editIcon.svg";

const profileDisplayOptions = [
    { value: "onsale", label: "On Sale" },
    { value: "collectibles", label: "Collectibles" },
    { value: "created", label: "Created" },
    { value: "likes", label: "Likes" },
    { value: "following", label: "Following" },
    { value: "followers", label: "Followers" },
];

async function getProfile(profileID: string): Promise<ProfileInterface | null> {
    try {
        const profileInfo = await fetch(`http://localhost:8000/profiles/${profileID}`);
        return profileInfo.json();
    } catch (err) {
        return null;
    }
}

async function getUserAuctions(profileID: string): Promise<AuctionWithProductInfo[] | null> {
    try {
        const auctionsResponse = await fetch(
            `http://localhost:8000/auctions/?full=true&profileID=${profileID}`
        );
        return auctionsResponse.json();
    } catch (err) {
        return null;
    }
}

export function Profile() {
    const { profileID } = useParams();
    const [profile, setProfile] = useState<ProfileInterface | null>(null);
    const [auctions, setAuctions] = useState<AuctionWithProductInfo[] | null>(null);
    const [selectedProfileDisplay, setSelectedProfileDisplay] = useState<string>("onsale");

    useEffect(() => {
        (async () => {
            if (!profileID) return;
            setProfile(await getProfile(profileID));
            setAuctions(await getUserAuctions(profileID));
        })();
    }, [profileID]);

    return (
        <div className={styles.profileContainer}>
            <div className={styles.coverPhotoWrapper}>
                <img className={styles.coverPhoto} alt="Cover" src={profile?.coverPicture} />
            </div>
            <div className={styles.contentContainer}>
                {profile && <ProfileInfoPanel profile={profile} />}
                <div className={styles.mainContent}>
                    <div className={styles.settingsButtons}>
                        <button type="button" className={styles.buttonOnCoverPhoto}>
                            Edit cover photo
                            <img
                                className={styles.buttonIcon}
                                src={imageIcon}
                                alt="editCoverPhoto"
                            />
                        </button>
                        <button type="button" className={styles.buttonOnCoverPhoto}>
                            Edit profile
                            <img className={styles.buttonIcon} src={editIcon} alt="editProfile" />
                        </button>
                    </div>
                    <div className={styles.profileDisplayOptions}>
                        {profileDisplayOptions.map((opt) => (
                            <label
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
                </div>
            </div>
        </div>
    );
}
