import React, { useEffect, useState } from "react";
import {
    getProfileActions,
    getFollowingProfilesActions,
    getAllActions,
} from "API/UserService/notifications";
import { useAppSelector } from "store/store";
import { NotificationObject } from "interfaces";
import { FilterStateInterface } from "./interfaces";
import { ActivityView } from "./ActivityView";
import { useNavigate } from "react-router-dom";

const DEFAULT_FILTER_STATE: FilterStateInterface = {
    sales: true,
    purchases: true,
    bids: true,
    likes: true,
    follows: true,
    startedAuctions: true,
};

export const Activity = () => {
    const [selectedFilters, setSelectedFilters] = useState(DEFAULT_FILTER_STATE);
    const [allNotifications, setAllNotifications] = useState<NotificationObject[]>([]);
    const [profileNotifications, setProfileNotifications] = useState<NotificationObject[]>([]);
    const [followingNotifications, setFollowingNotifications] = useState<NotificationObject[]>([]);
    const [notifications, setNotifications] = useState<NotificationObject[]>([]);
    const activeProfile = useAppSelector((state) => state.activeProfile.activeProfile);
    const navigate = useNavigate();
    useEffect(() => {
        if (!activeProfile) return navigate("/login");
        getProfileActions(activeProfile?._id, DEFAULT_FILTER_STATE).then((data) => {
            setProfileNotifications(data);
            setNotifications(data);
        });
        getFollowingProfilesActions(activeProfile?._id, DEFAULT_FILTER_STATE).then((data) =>
            setFollowingNotifications(data)
        );
        getAllActions(DEFAULT_FILTER_STATE).then((data) => setAllNotifications(data));
    }, [activeProfile]);

    useEffect(() => {
        if (!activeProfile) return;
        getProfileActions(activeProfile?._id, selectedFilters).then((data) => {
            setProfileNotifications(data);
            setNotifications(data);
        });
        getFollowingProfilesActions(activeProfile?._id, selectedFilters).then((data) =>
            setFollowingNotifications(data)
        );
        getAllActions(selectedFilters).then((data) => setAllNotifications(data));
    }, [selectedFilters]);

    const onCategorySelect = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        if (target.id === "myActivity") setNotifications(profileNotifications);
        if (target.id === "following") setNotifications(followingNotifications);
        if (target.id === "allActivity") setNotifications(allNotifications);
    };

    const onFilterSelect = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setSelectedFilters({
            ...selectedFilters,
            [target.id]: !selectedFilters[target.id as keyof FilterStateInterface],
        });
    };

    const onSelectAll = () => {
        setSelectedFilters(DEFAULT_FILTER_STATE);
    };

    const onUnselectAll = () => {
        setSelectedFilters({
            sales: false,
            purchases: false,
            bids: false,
            likes: false,
            follows: false,
            startedAuctions: false,
        });
    };

    return (
        <ActivityView
            notifications={notifications}
            onCategorySelect={onCategorySelect}
            onFilterSelect={onFilterSelect}
            selectedFilters={selectedFilters}
            onSelectAll={onSelectAll}
            onUnselectAll={onUnselectAll}
        />
    );
};
