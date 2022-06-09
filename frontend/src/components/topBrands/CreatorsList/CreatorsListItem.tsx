import { ProfilePicture } from "components";
import styles from "./CreatorsListItem.module.scss";
import { ProfileInterface } from "interfaces";
import { Link } from "react-router-dom";

interface CreatorsListItemProps {
    profile: ProfileInterface;
    about?: boolean;
    offer?: number;
}

export const CreatorsListItem = ({ profile, offer, about }: CreatorsListItemProps) => {
    return (
        <Link to={`/profile/${profile._id}`}>
            <div className={styles.creatorContainer}>
                <ProfilePicture width={"56px"} url={profile.profilePicture} />
                {profile.badge ? <span className={styles.avatarBadge}></span> : null}
                <div className={styles.creatorInfo}>
                    <p className={styles.creatorName}>{profile.profileName}</p>
                    {about && <p className={styles.creatorAbout}>{profile.about}</p>}
                    {offer && (
                        <span className={styles.creatorNFTSValue}>
                            {offer}
                            <span className={styles.ETHText}>$</span>
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};
export default CreatorsListItem;
