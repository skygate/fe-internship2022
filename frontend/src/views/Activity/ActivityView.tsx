import style from "./activity.module.scss";
import { HorizontalSelectButtons, CheckboxInput, Notification, SmallButton } from "components";
import React from "react";
import { menuButtons, filterOptions } from "./arrays";
import { NotificationObject } from "interfaces";
import { FilterStateInterface } from "./interfaces";

interface ActivityViewProps {
    allNotifications: NotificationObject[];
    onCategorySelect: (e: React.MouseEvent) => void;
    onFilterSelect: (e: React.ChangeEvent) => void;
    selectedFilters: FilterStateInterface;
    onSelectAll: () => void;
    onUnselectAll: () => void;
}

export const ActivityView = ({
    allNotifications,
    onCategorySelect,
    onFilterSelect,
    selectedFilters,
    onSelectAll,
    onUnselectAll,
}: ActivityViewProps) => {
    return (
        <div className={style.activity}>
            <div className={style.leftColumn}>
                <div className={style.titleWrapper}>
                    <h2 className={style.title}>Activity</h2>
                    <SmallButton text="Mark as read" />
                </div>
                <HorizontalSelectButtons buttons={menuButtons} onSelect={onCategorySelect} />
                <div className={style.notifications}>
                    {allNotifications.map(
                        (item, index) => item && <Notification object={item} key={index} />
                    )}
                </div>
            </div>
            <div className={style.filtersWrapper}>
                <h3 className={style.filtersTitle}>Filters</h3>
                {filterOptions.map((item) => (
                    <CheckboxInput
                        key={item.label}
                        label={item.label}
                        id={item.id}
                        onClick={onFilterSelect}
                        checked={selectedFilters[item.id as keyof FilterStateInterface]}
                    />
                ))}
                <div className={style.buttons}>
                    <SmallButton text="Select all" onClick={onSelectAll} />
                    <SmallButton text="Unselect all" onClick={onUnselectAll} />
                </div>
            </div>
        </div>
    );
};
