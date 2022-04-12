import style from "./popular.module.scss";
import arrowLeft from "../../assets/arrowLeft.svg";
import arrowRight from "../../assets/arrowRight.svg";
import { PopularItem } from "../";
import profilePicture from "../../assets/profilePicture.png";

export const Popular = () => {
    return (
        <section className={style.popular}>
            <div className={style.container}>
                <div className={style.categoriesAndFilters}>
                    <div className={style.leftSide}>
                        <p className={style.title}>Popular</p>
                        <select name="category" id="category" className={style.categorySelect}>
                            <option value="sellers">Sellers</option>
                            <option value="tokens">Tokens</option>
                            <option value="example1">Example1</option>
                            <option value="example2">Example2</option>
                        </select>
                    </div>
                    <select name="filter" id="filter" className={style.filterSelect}>
                        <option value="sellers">Today</option>
                        <option value="tokens">Week</option>
                        <option value="example1">Month</option>
                        <option value="example2">Ever</option>
                    </select>
                </div>

                <div className={style.popularItems}>
                    <div className={style.swipeLeft}>
                        <img src={arrowLeft} alt="swipe left" />
                    </div>
                    <div className={style.items}>
                        <PopularItem
                            imageUrl={profilePicture}
                            name="Edd Harris"
                            ethValue={2.456}
                            rangingNumber={1}
                        />
                        <PopularItem
                            imageUrl={profilePicture}
                            name="Edd Harris"
                            ethValue={2.456}
                            rangingNumber={2}
                        />
                        <PopularItem
                            imageUrl={profilePicture}
                            name="Edd Harris"
                            ethValue={2.456}
                            rangingNumber={3}
                        />
                        <PopularItem
                            imageUrl={profilePicture}
                            name="Edd Harris"
                            ethValue={2.456}
                            rangingNumber={4}
                        />
                        <PopularItem
                            imageUrl={profilePicture}
                            name="Edd Harris"
                            ethValue={2.456}
                            rangingNumber={5}
                        />
                    </div>
                    <div className={style.swipeRight}>
                        <img src={arrowRight} alt="swipe left" />
                    </div>
                </div>
            </div>
        </section>
    );
};
