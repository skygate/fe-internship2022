import styles from "./createdProduct.module.scss";
import { Product } from "interfaces/product";
import { deleteProduct } from "API/UserService/product";
import { useAppDispatch, useAppSelector } from "store/store";
import { fetchUserProducts } from "store/userProducts";

export interface CreatedProductProps {
    item: Product;
    profileID: string;
}

export const CreatedProduct = ({ item, profileID }: CreatedProductProps) => {
    const dispatch = useAppDispatch();
    const activeProfile = useAppSelector((state) => state.activeProfile.activeProfile?._id);
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img className={styles.image} src={item.productImageUrl} alt="product" />
                {activeProfile === item.ownerID && (
                    <div className={styles.imageHoverSection}>
                        <div className={styles.imageHoverContainer}>
                            <button
                                className={styles.deleteButton}
                                type="button"
                                onClick={async () => {
                                    if (activeProfile === item.ownerID) {
                                        await deleteProduct(item._id);
                                        await dispatch(fetchUserProducts(profileID));
                                    }
                                }}
                            >
                                Delete
                            </button>
                            <div className={styles.startAuction}>
                                <button type="button" className={styles.startAuctionButton}>
                                    <span>Start auction!</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <span className={styles.productName}>{item.productName}</span>
            <span className={styles.productDescription}>{item.productDescription}</span>
        </div>
    );
};
