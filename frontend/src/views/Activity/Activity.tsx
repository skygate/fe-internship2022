import React, { useEffect, useState } from "react";
import { getAllActionsForProfile } from "API/UserService/notifications";
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
    const [selectedCategory, setSelectedCategory] = useState("myActivity");
    const [selectedFilters, setSelectedFilters] = useState(DEFAULT_FILTER_STATE);
    const [allNotifications, setAllNotifications] = useState<NotificationObject[]>([]);
    const activeProfile = useAppSelector((state) => state.activeProfile.activeProfile);

    useEffect(() => {
        if (!activeProfile) return;
        getAllActionsForProfile(activeProfile?._id).then((data) => setAllNotifications(data));
    }, []);

    const onCategorySelect = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        setSelectedCategory(target.id);
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
            allNotifications={allNotifications}
            onCategorySelect={onCategorySelect}
            onFilterSelect={onFilterSelect}
            selectedFilters={selectedFilters}
            onSelectAll={onSelectAll}
            onUnselectAll={onUnselectAll}
        />
    );
};
