import styles from "./NavbarDropDown.module.scss";
import { useAppSelector } from "store/store";
import { useState, useCallback, useEffect, useRef } from "react";
import SignOutIcon from "assets/SignOutIcon.svg";
import { logoutUser } from "API/UserService";
import { useAppDispatch } from "store/store";
import { setUser } from "store/user";
import { changeActiveProfile } from "store/activeProfile";
import { ProfilePicture, Modal } from "components";
import ArrowDownSign from "assets/ArrowDownSign.svg";
import profileIcon from "assets/profileIcon.svg";
import plusIcon from "assets/plusIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { ProfileModal } from "components/Modal";
import { useOutsideAlerter } from "hooks/useOutsideAlerter";

export function NavbarDropDown() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const profiles = useAppSelector((state) => state.profiles);
    const activeAccount = useAppSelector((state) => state.activeProfile);
    const [activeDropdownButton, setActiveDropdownButton] = useState(false);
    const [activeProfileSwitchButton, setActiveProfileSwitchButton] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setActiveDropdownButton);

    const escFunction = useCallback(
        (e) => {
            if (e.key === "Escape") {
                setActiveDropdownButton(false);
            }
        },
        [setActiveDropdownButton]
    );

    useEffect(() => {
        if (activeDropdownButton) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeDropdownButton]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const navigate = useNavigate();
    return (
        <div className={styles.dropdownMenu} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => {
                    setActiveDropdownButton(!activeDropdownButton);
                    setActiveProfileSwitchButton(false);
                }}
                className={styles.dropdownButton}
            >
                <ProfilePicture width="32px" url={activeAccount.activeProfile?.profilePicture} />
                <span className={styles.buttonText}>
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
                    onClick={() => setActiveDropdownButton(false)}
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
                        navigate("/");
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
                    <ProfileModal
                        isNew={true}
                        userID={user.userID}
                        changeVisiblity={() => setIsModalVisible(false)}
                    />
                </Modal>
            )}
        </div>
    );
}
