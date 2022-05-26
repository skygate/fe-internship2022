import { ProfilePicture } from "components";
import styles from "./CreatorsListItem.module.scss";
import { ProfileInterface } from "interfaces";

interface CreatorsListItemProps {
    profile: ProfileInterface;
    offer?: number;
}

export const CreatorsListItem = ({ profile, offer }: CreatorsListItemProps) => {
    return (
        <div className={styles.creatorContainer}>
            <ProfilePicture width={"56px"} url={profile.profilePicture} />
            {profile.badge ? <span className={styles.avatarBadge}></span> : null}
            <div className={styles.creatorInfo}>
                <span className={styles.creatorName}>{profile.profileName}</span>
                {offer ? (
                    <span className={styles.creatorNFTSValue}>
                        {offer}
                        <span className={styles.ETHText}>ETH</span>
                    </span>
                ) : null}

                <span className={styles.creatorNFTSValue}>
                    {profile.totalEthValue ? profile.totalEthValue : null}
                    <span className={styles.ETHText}>ETH</span>
                </span>
            </div>
        </div>
    );
};
export default CreatorsListItem;
