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

const DEFAULT_FILTER_STATE: FilterStateInterface = {
    sales: false,
    purchase: false,
    bids: false,
    likes: false,
};

export const Activity = () => {
    const [selectedFilters, setSelectedFilters] = useState(DEFAULT_FILTER_STATE);
    const [allNotifications, setAllNotifications] = useState<NotificationObject[]>([]);
    const [profileNotifications, setProfileNotifications] = useState<NotificationObject[]>([]);
    const [followingNotifications, setFollowingNotifications] = useState<NotificationObject[]>([]);
    const [notifications, setNotifications] = useState<NotificationObject[]>([]);
    const activeProfile = useAppSelector((state) => state.activeProfile.activeProfile);

    useEffect(() => {
        if (!activeProfile) return;
        getProfileActions(activeProfile?._id).then((data) => {
            setProfileNotifications(data);
            setNotifications(data);
        });
        getFollowingProfilesActions(activeProfile?._id).then((data) =>
            setFollowingNotifications(data)
        );
        getAllActions().then((data) => setAllNotifications(data));
    }, [activeProfile]);

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
        setSelectedFilters({
            sales: true,
            purchase: true,
            bids: true,
            likes: true,
        });
    };

    const onUnselectAll = () => {
        setSelectedFilters(DEFAULT_FILTER_STATE);
    };

    return (
        <ActivityView
            allNotifications={notifications}
            onCategorySelect={onCategorySelect}
            onFilterSelect={onFilterSelect}
            selectedFilters={selectedFilters}
            onSelectAll={onSelectAll}
            onUnselectAll={onUnselectAll}
        />
    );
};
