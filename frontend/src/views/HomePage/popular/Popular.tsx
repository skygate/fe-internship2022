import style from "./popular.module.scss";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";
import { PopularSeller } from "components";
import { useEffect, useState } from "react";
import { getAllProfiles } from "API/UserService/profile";
import { ProfileInterface } from "interfaces";
import { PopularView } from "./PopularView";

const ITEMS_PER_PAGE = 5;

export const Popular = () => {
    const [allSellers, setAllSellers] = useState<ProfileInterface[]>([]);
    const [visibleSellers, setVisibleSellers] = useState<ProfileInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const LAST_PAGE_INDEX = Math.ceil(allSellers.length / ITEMS_PER_PAGE) - 1;
    useEffect(() => {
        getAllProfiles().then((res) =>
            setAllSellers(
                res.sort((a: ProfileInterface, b: ProfileInterface) => {
                    if (!a.followers || !b.followers) return;
                    return a.followers.length - b.followers.length;
                })
            )
        );
    }, []);

    useEffect(() => {
        setVisibleSellers(allSellers.slice(0, ITEMS_PER_PAGE));
    }, [allSellers]);

    useEffect(() => {
        setVisibleSellers(
            allSellers.slice(
                currentPage * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
            )
        );
    }, [currentPage]);

    const changePage = (side: string) => {
        if (side === "left" && currentPage > 0) setCurrentPage((currentPage) => currentPage - 1);
        if (side === "right" && currentPage < LAST_PAGE_INDEX)
            setCurrentPage((currentPage) => currentPage + 1);
    };

    return (
        <PopularView
            visibleSellers={visibleSellers}
            currentPage={currentPage}
            lastPageIndex={LAST_PAGE_INDEX}
            itemsPerPage={ITEMS_PER_PAGE}
            changePage={changePage}
        />
    );
};
