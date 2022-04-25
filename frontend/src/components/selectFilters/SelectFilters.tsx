import React from "react";
import style from "./selectFilters.module.scss";

export const SelectFilters = () => {
    enum FilterSelectType {
        Price = "priceFilter",
        Likes = "likesFilter",
        Creator = "creatorFilter",
    }

    interface FilterSelectValues {
        id: string;
        value: string;
    }

    interface FilterSelect {
        name: FilterSelectType;
        label: string;
        values: FilterSelectValues[];
    }

    const filtersSelect: FilterSelect[] = [
        {
            name: FilterSelectType.Price,
            label: "PRICE",
            values: [
                {
                    id: "highestPrice",
                    value: "Highest Price",
                },
                {
                    id: "lowestPrice",
                    value: "Lowest Price",
                },
                {
                    id: "default",
                    value: "-",
                },
            ],
        },
        {
            name: FilterSelectType.Likes,
            label: "LIKES",
            values: [
                {
                    id: "mostLiked",
                    value: "Most liked",
                },
                {
                    id: "leastLiked",
                    value: "Least liked",
                },
                {
                    id: "default",
                    value: "-",
                },
            ],
        },
        {
            name: FilterSelectType.Creator,
            label: "CREATOR",
            values: [
                {
                    id: "onlyVerified",
                    value: "Only verified",
                },
                {
                    id: "all",
                    value: "All",
                },
            ],
        },
    ];

    const renderSelectFilters = () => {
        return filtersSelect.map((item) => {
            return (
                <div className={style.selectFilter} key={item.label}>
                    <label htmlFor={item.name}>{item.label}</label>
                    <select name={item.name} id={item.name}>
                        {item.values.map((value) => {
                            return (
                                <option value={value.id} key={value.id}>
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
