import styles from "./ProfileInfoPanel.module.scss";
import { FC, useEffect } from "react";
import { useState } from "react";
import { ProfileInterface } from "interfaces/ProfileInterface";
import { ProfilePicture } from "components/profilePicture/ProfilePicture";
import Globe from "../../assets/Globe.svg";
import facebook from "../../assets/facebook.svg";
import instagram from "../../assets/instagram.svg";
import twitter from "../../assets/twitter.svg";
import format from "date-fns/format";
import { followProfile } from "API/UserService/profile";
import { unfollowProfile } from "API/UserService/profile";
import { useAppSelector } from "store/store";
import { ActiveProfileSelector } from "store/activeProfile";
import { ErrorToast } from "components/ToastWrapper/Toasts";

interface ProfileInfoProp {
    profile: ProfileInterface;
    setProfile: () => void;
}

const defaultProfilePicture =
    "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";

export const ProfileInfoPanel: FC<ProfileInfoProp> = ({ profile, setProfile }) => {
    const activeProfile = useAppSelector(ActiveProfileSelector);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFollower, setIsFollower] = useState(false);
    const maxWebsiteUrlLength = 17;
    const maxUsernameLength = 10;

    useEffect(() => {
        checkIsFollowing();
    }, [profile, activeProfile.activeProfile]);

    const checkIsFollowing = () => {
        const result =
            profile.followers &&
            profile.followers.find(
                (follower) => follower.follower.profileID._id === activeProfile.activeProfile?._id
            );
        setIsFollower(!!result);
    };

    const follow = async () => {
        if (activeProfile.activeProfile?._id) {
            await followProfile(activeProfile.activeProfile._id, profile._id).catch((response) =>
                ErrorToast(response.response.data)
            );
            setProfile();
        }
    };

    const unfollow = async () => {
        if (activeProfile.activeProfile?._id) {
            await unfollowProfile(activeProfile.activeProfile._id, profile._id).catch((response) =>
                ErrorToast(response.response.data)
            );
            setProfile();
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileAvatar}>
                <ProfilePicture
                    width={"160px"}
                    url={profile.profilePicture ? profile.profilePicture : defaultProfilePicture}
                />
            </div>
            <span className={styles.usernameText}>
                {profile.profileName.slice(0, maxUsernameLength)}
            </span>
            <div className={isExpanded ? styles.aboutExpanded : styles.aboutWrapper}>
                <span className={styles.aboutText} onClick={() => setIsExpanded(!isExpanded)}>
                    {profile.about}
                </span>
            </div>
            <div className={styles.website}>
                <img src={Globe} alt="globe" />
                <a
                    href={`http://${profile.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteText}
                >
                    {profile.websiteUrl && profile.websiteUrl?.length > 20
                        ? `${profile.websiteUrl?.slice(0, maxWebsiteUrlLength)}...`
                        : profile.websiteUrl}
                </a>
            </div>
            {activeProfile.activeProfile?._id && activeProfile.activeProfile?._id !== profile._id && (
                <div>
                    {!isFollower ? (
                        <button type="button" className={styles.followButton} onClick={follow}>
                            Follow
                        </button>
                    ) : (
                        <button type="button" className={styles.followButton} onClick={unfollow}>
                            Unfollow
                        </button>
                    )}
                </div>
            )}
            <div className={styles.socialMediaContainer}>
                <a href={`http://${profile.twitterUrl}`} target="_blank" rel="noopener noreferrer">
                    <img src={twitter} alt="twitter" />
                </a>
                <a
                    href={`http://${profile.instagramUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={instagram} alt="instagram" />
                </a>
                <a href={`http://${profile.facebookUrl}`} target="_blank" rel="noopener noreferrer">
                    <img src={facebook} alt="facebook" />
                </a>
            </div>
            <span className={styles.memberSince}>
                Member since{" "}
                {profile.joinDate ? format(new Date(profile.joinDate), "MMM d, yyyy") : null}
            </span>
        </div>
    );
};
export default ProfileInfoPanel;
