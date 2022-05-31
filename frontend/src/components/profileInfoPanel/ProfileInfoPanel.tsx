import styles from "./ProfileInfoPanel.module.scss";
import { FC } from "react";
import { useState } from "react";
import { ProfileInterface } from "interfaces/ProfileInterface";
import { ProfilePicture } from "components/profilePicture/ProfilePicture";
import Globe from "../../assets/Globe.svg";
import facebook from "../../assets/facebook.svg";
import instagram from "../../assets/instagram.svg";
import twitter from "../../assets/twitter.svg";
import format from "date-fns/format";

interface ProfileInfoProp {
    profile: ProfileInterface;
}

export const ProfileInfoPanel: FC<ProfileInfoProp> = ({ profile }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxWebsiteUrlLength = 17;
    const maxUsernameLength = 10;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileAvatar}>
                <ProfilePicture width={"160px"} url={profile.profilePicture} />
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
            <button type="button" className={styles.followButton}>
                Follow
            </button>
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
