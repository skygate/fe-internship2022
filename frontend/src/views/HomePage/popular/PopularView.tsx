import style from "./popular.module.scss";
import { ProfileInterface } from "interfaces";
import arrowLeft from "assets/arrowLeft.svg";
import arrowRight from "assets/arrowRight.svg";
import { PopularSeller } from "components";

interface PopularViewProps {
    currentPage: number;
    lastPageIndex: number;
    itemsPerPage: number;
    changePage: (arg: string) => void;
    visibleSellers: ProfileInterface[];
}

export const PopularView = ({
    currentPage,
    lastPageIndex,
    itemsPerPage,
    changePage,
    visibleSellers,
}: PopularViewProps) => {
    return (
        <section className={style.popular}>
            <div className={style.container}>
                <div className={style.categoriesAndFilters}>
                    <div className={style.leftSide}>
                        <p className={style.title}>Popular</p>
                        <h3 className={style.sellersHeader}>Sellers</h3>
                    </div>
                </div>

                <div className={style.popularItems}>
                    <div
                        className={
                            currentPage > 0
                                ? `${style.swipeLeft} ${style.arrowHover}`
                                : style.swipeLeft
                        }
                        onClick={() => changePage("left")}
                    >
                        <img src={arrowLeft} alt="swipe left" />
                    </div>
                    <div className={style.items}>
                        {visibleSellers.map((item, index) => (
                            <PopularSeller
                                profile={item}
                                key={item._id}
                                index={currentPage * itemsPerPage + index + 1}
                            />
                        ))}
                    </div>
                    <div
                        className={
                            currentPage === lastPageIndex
                                ? style.swipeRight
                                : `${style.swipeRight} ${style.arrowHover}`
                        }
                        onClick={() => changePage("right")}
                    >
                        <img src={arrowRight} alt="swipe right" />
                    </div>
                </div>
            </div>
        </section>
    );
};
