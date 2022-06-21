import leftArrow from "assets/arrowLeft.svg";
import rightArrow from "assets/arrowRight.svg";
import { useState, FC } from "react";
import { PageSlice, ProfileInterface } from "interfaces/ProfileInterface";
import styles from "./ProfileFollowList.module.scss";
import { PopularSeller } from "components";
import { useNavigate } from "react-router-dom";

interface ProfileList {
    profiles: ProfileInterface[];
    followers: boolean;
}

export const ProfileFollowList: FC<ProfileList> = ({ profiles, followers }) => {
    const [createdPageNumber, setCreatedPageNumber] = useState<PageSlice>({
        firstItem: 0,
        lastItem: 3,
    });
    const navigate = useNavigate();
    const itemsPerPage = 3;
    const listIsNotEmpty = profiles.length > 0;
    return (
        <div className={styles.createdListContainer}>
            {listIsNotEmpty ? (
                <div className={styles.createdList}>
                    <div className={styles.itemsBox}>
                        {profiles
                            .slice(createdPageNumber.firstItem, createdPageNumber.lastItem)
                            .map((profile, index) => (
                                <div
                                    key={index}
                                    className={styles.profileCard}
                                    onClick={() => {
                                        navigate(`/profile/${profile._id}`);
                                    }}
                                >
                                    <PopularSeller profile={profile} />
                                </div>
                            ))}
                    </div>
                    <div className={styles.arrows}>
                        <div>
                            {createdPageNumber.firstItem > 0 && (
                                <img
                                    src={leftArrow}
                                    alt="arrow left"
                                    className={styles.arrow}
                                    id="prevPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem - itemsPerPage,
                                            lastItem: createdPageNumber.lastItem - itemsPerPage,
                                        })
                                    }
                                />
                            )}
                        </div>
                        <div>
                            {createdPageNumber.lastItem < profiles.length && (
                                <img
                                    src={rightArrow}
                                    alt="arrow right"
                                    className={styles.arrow}
                                    id="nextPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem + itemsPerPage,
                                            lastItem: createdPageNumber.lastItem + itemsPerPage,
                                        })
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : followers ? (
                <h1 className={styles.profilesEmptyText}>This user has not any followers</h1>
            ) : (
                <h1 className={styles.profilesEmptyText}>This user is not following any person</h1>
            )}
        </div>
    );
};
