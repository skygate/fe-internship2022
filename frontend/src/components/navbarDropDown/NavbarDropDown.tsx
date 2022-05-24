import styles from "./NavbarDropDown.module.scss";
import { useAppSelector } from "store/store";
import { useState } from "react";
import SignOutIcon from "../../assets/SignOutIcon.svg";
import { logoutUser } from "API/UserService";
import { useAppDispatch } from "store/store";
import { setUser } from "store/user";
import { changeActiveProfile } from "store/activeProfile";
import { ProfilePicture } from "components";
import ArrowDownSign from "../../assets/ArrowDownSign.svg";
import profileIcon from "../../assets/profileIcon.svg";
import plusIcon from "../../assets/plusIcon.svg";
import { Link } from "react-router-dom";
import Modal from "components/Modal/Modal";
import { ProfileModal } from "components/Modal/ProfileModal/ProfileModal";

export function NavbarDropDown() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const profiles = useAppSelector((state) => state.profiles);
    const activeAccount = useAppSelector((state) => state.activeProfile);
    const [activeDropdownButton, setActiveDropdownButton] = useState(false);
    const [activeProfileSwitchButton, setActiveProfileSwitchButton] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <div className={styles.dropdownMenu}>
            <button
                type="button"
                onClick={() => {
                    setActiveDropdownButton(!activeDropdownButton);
                    setActiveProfileSwitchButton(false);
                }}
                className={styles.dropdownButton}
            >
                <ProfilePicture width="32px" url={activeAccount.activeProfile?.profilePicture} />
                <span>
                    {activeAccount.activeProfile?.profileName &&
                        activeAccount.activeProfile.profileName.slice(0, 14)}
                </span>
                <img src={ArrowDownSign} alt="arrow" />
            </button>
            <div
                className={
                    activeDropdownButton ? styles.showDropdownContent : styles.dropdownContent
                }
            >
                <span className={styles.profileName}>
                    {activeAccount.activeProfile?.profileName}
                </span>
                <Link
                    to={`profile/${activeAccount.activeProfile?._id}`}
                    className={styles.dropdownListButton}
                >
                    {" "}
                    <img src={profileIcon} alt="profile" className={styles.dropdownListIcon} />
                    My profile
                </Link>
                <button
                    onClick={() => setActiveProfileSwitchButton(!activeProfileSwitchButton)}
                    type="button"
                    className={styles.dropdownListButton}
                >
                    <ProfilePicture
                        width="20px"
                        url={activeAccount.activeProfile?.profilePicture}
                    />
                    <span>Switch profile</span>
                </button>
                <div
                    className={
                        activeProfileSwitchButton ? styles.showProfiles : styles.dropdownContent
                    }
                >
                    {profiles.profiles.map((profile) => (
                        <button
                            onClick={() => {
                                dispatch(changeActiveProfile({ profiles: [profile] }));
                            }}
                            key={profile._id}
                            type="button"
                            className={styles.profilesListItem}
                        >
                            <ProfilePicture width="20px" url={profile.profilePicture} />
                            <span>{profile.profileName && profile.profileName.slice(0, 14)}</span>
                            {profile._id === activeAccount.activeProfile?._id ? (
                                <span className={styles.activeProfileText}>active</span>
                            ) : (
                                <span></span>
                            )}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={styles.profilesListItem}
                        onClick={() => setIsModalVisible(true)}
                    >
                        <img src={plusIcon} alt="plus" className={styles.dropdownListIcon} />
                        Create new profile
                    </button>
                </div>
                <button
                    onClick={async () => {
                        await logoutUser();
                        dispatch(setUser());
                    }}
                    className={styles.dropdownListButton}
                    type="button"
                >
                    <img src={SignOutIcon} alt="disconnect" className={styles.dropdownListIcon} />
                    Disconnect
                </button>
            </div>
            {isModalVisible && (
                <Modal
                    visible={isModalVisible}
                    onClose={() => {
                        setIsModalVisible(false);
                    }}
                    title="Create new profile"
                >
                    <ProfileModal isNew={true} userID={user.userID} />
                </Modal>
            )}
        </div>
    );
}
