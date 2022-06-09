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
    profileID: string;
    setAuctions: () => void;
}

export const CreatedItems: FC<ProductsList> = ({ usersProducts, profileID, setAuctions }) => {
    const [createdPageNumber, setCreatedPageNumber] = useState<PageSlice>({
        firstItem: 0,
        lastItem: 3,
    });
    const itemsPerPage = 3;
    const listIsNotEmpty = usersProducts.length > 0;
    return (
        <div className={styles.createdListContainer}>
            {listIsNotEmpty ? (
                <div className={styles.createdList}>
                    <div className={styles.itemsBox}>
                        {usersProducts
                            .slice(createdPageNumber.firstItem, createdPageNumber.lastItem)
                            .map((product, index) => (
                                <div key={index} className={styles.productCard}>
                                    <CreatedProduct
                                        item={product}
                                        profileID={profileID}
                                        setAuctions={setAuctions}
                                    />
                                </div>
                            ))}
                    </div>
                    <div className={styles.arrows}>
                        <div>
                            {createdPageNumber.firstItem > 0 && (
                                <img
                                    src={leftArrow}
                                    alt="arrow left"
                                    className={styles.arrow}
                                    id="prevPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem - itemsPerPage,
                                            lastItem: createdPageNumber.lastItem - itemsPerPage,
                                        })
                                    }
                                />
                            )}
                        </div>
                        <div>
                            {createdPageNumber.lastItem < usersProducts.length && (
                                <img
                                    src={rightArrow}
                                    alt="arrow right"
                                    className={styles.arrow}
                                    id="nextPage"
                                    onClick={() =>
                                        setCreatedPageNumber({
                                            firstItem: createdPageNumber.firstItem + itemsPerPage,
                                            lastItem: createdPageNumber.lastItem + itemsPerPage,
                                        })
                                    }
                                />
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
