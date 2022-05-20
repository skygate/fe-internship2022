import React from "react";
import style from "./selectFilters.module.scss";

interface SelectFiltersProps {
    onFieldSelect: (e: React.ChangeEvent) => void;
}

export const SelectFilters = ({ onFieldSelect }: SelectFiltersProps) => {
    enum FilterSelectType {
        Sort = "sort",
        TimeFilter = "timeFilter",
        Price = "priceFilter",
        Likes = "likesFilter",
        Creator = "creatorFilter",
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
        values: FilterSelectValues[];
    }

    const filtersSelect: FilterSelect[] = [
        {
            name: FilterSelectType.Sort,
            label: "SORT",
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

    const renderSelectFilters = () => {
        return filtersSelect.map((item) => {
            return (
                <div className={style.selectFilter} key={item.label}>
                    <label htmlFor={item.name}>{item.label}</label>
                    <select name={item.name} id={item.name} onChange={onFieldSelect}>
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
