import leftArrow from "assets/arrowLeft.svg";
import rightArrow from "assets/arrowRight.svg";
import { CreatedProduct } from "components";
import { useState } from "react";
import { PageSlice } from "interfaces/ProfileInterface";
import { Product } from "interfaces/product";
import styles from "./CreatedItems.module.scss";
import { FC } from "react";

interface ProductsList {
    usersProducts: Product[];
}

export const CreatedItems: FC<ProductsList> = ({ usersProducts }) => {
    const [createdPageNumber, setCreatedPageNumber] = useState<PageSlice>({
        firstItem: 0,
        lastItem: 3,
    });
    return (
        <div className={styles.createdListt}>
            {usersProducts.length > 0 ? (
                <div className={styles.createdList}>
                    <div className={styles.itemsBox}>
                        {usersProducts &&
                            usersProducts
                                .slice(createdPageNumber.firstItem, createdPageNumber.lastItem)
                                .map((product, index) => (
                                    <div className={styles.productCard}>
                                        <CreatedProduct key={index} item={product} />
                                    </div>
                                ))}
                    </div>
                    <div className={styles.arrows}>
                        <div>
                            {createdPageNumber.firstItem > 0 ? (
                                <img
                                    src={leftArrow}
                                    alt="arrow left"
                                    className={styles.arrow}
                                    id="prevPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem - 3,
                                            lastItem: createdPageNumber.lastItem - 3,
                                        })
                                    }
                                />
                            ) : (
                                <></>
                            )}{" "}
                        </div>
                        <div>
                            {createdPageNumber.lastItem <= usersProducts.length ? (
                                <img
                                    src={rightArrow}
                                    alt="arrow right"
                                    className={styles.arrow}
                                    id="nextPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem + 3,
                                            lastItem: createdPageNumber.lastItem + 3,
                                        })
                                    }
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <span className={styles.productsEmptyText}>
                    This user has not any products created
                </span>
            )}
        </div>
    );
};
