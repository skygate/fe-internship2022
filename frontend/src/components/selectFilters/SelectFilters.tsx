import React, { useEffect, useState } from "react";
import style from "./selectFilters.module.scss";
import { DiscoverFormState } from "interfaces";

interface SelectFiltersProps {
    onFieldSelect: (e: React.ChangeEvent) => void;
    formState: DiscoverFormState;
}

export const SelectFilters = ({ onFieldSelect, formState }: SelectFiltersProps) => {
    useEffect(() => {
        setSelectedSorting(formState.sort);
        setSelectedTime(formState.time);
        setSelectedAscending(formState.ascending);
    });

    useEffect(() => {
        setDefaultSortValue(checkDefaultSortValue());
    });

    const [selectedTime, setSelectedTime] = useState(formState.time);
    const [selectedSorting, setSelectedSorting] = useState(formState.sort);
    const [selectedAscending, setSelectedAscending] = useState(formState.ascending);
    const [defaultSortValue, setDefaultSortValue] = useState("dateAscending");

    enum FilterSelectType {
        Sort = "sort",
        TimeFilter = "timeFilter",
    }

    interface FilterSelectValues {
        id: string;
        value: string;
        filterBy?: string;
        ascending?: string;
    }

    interface FilterSelect {
        name: FilterSelectType;
        label: string;
        defaultValue: string;
        values: FilterSelectValues[];
    }

    const filtersSelect: FilterSelect[] = [
        {
            name: FilterSelectType.Sort,
            label: "SORT",
            defaultValue: defaultSortValue,
            values: [
                {
                    id: "dateAscending",
                    value: "Date ascending order",
                    filterBy: "startDate",
                    ascending: "-1",
                },
                {
                    id: "dateDescending",
                    value: "Date descending order",
                    filterBy: "startDate",
                    ascending: "1",
                },
                {
                    id: "highestPrice",
                    value: "Highest Price",
                    filterBy: "price",
                    ascending: "-1",
                },
                {
                    id: "lowestPrice",
                    value: "Lowest Price",
                    filterBy: "price",
                    ascending: "1",
                },
                {
                    id: "mostLiked",
                    value: "Most liked",
                    filterBy: "likes",
                    ascending: "-1",
                },
                {
                    id: "leastLiked",
                    value: "Least Liked",
                    filterBy: "likes",
                    ascending: "1",
                },
            ],
        },
        {
            name: FilterSelectType.TimeFilter,
            label: "TIME",
            defaultValue: selectedTime,
            values: [
                {
                    id: "ever",
                    value: "Ever",
                },
                {
                    id: "week",
                    value: "Last week",
                },
                {
                    id: "month",
                    value: "Last month",
                },
            ],
        },
    ];

    const checkDefaultSortValue = () => {
        const foundItem = filtersSelect[0].values.find(
            (item) => item.filterBy === selectedSorting && item.ascending === selectedAscending
        );

        return foundItem ? foundItem.id : "dateAscending";
    };

    const renderSelectFilters = () => {
        return filtersSelect.map((item) => {
            return (
                <div className={style.selectFilter} key={item.label}>
                    <label htmlFor={item.name}>{item.label}</label>
                    <select
                        name={item.name}
                        id={item.name}
                        onChange={onFieldSelect}
                        value={item.defaultValue}
                    >
                        {item.values.map((value) => {
                            return (
                                <option
                                    value={value.id}
                                    key={value.id}
                                    data-ascending={value.ascending}
                                    data-filterby={value.filterBy}
                                >
                                    {value.value}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );
        });
    };

    return <>{renderSelectFilters()}</>;
};
