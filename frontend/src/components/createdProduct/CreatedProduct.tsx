import styles from "./createdProduct.module.scss";
import { Product } from "interfaces/product";
import { deleteProduct } from "API/UserService/product";
import { useAppDispatch, useAppSelector } from "store/store";
import { fetchUserProducts } from "store/userProducts";
import { useState } from "react";
import { Modal } from "components/Modal/Modal";
import { AddAuctionModal } from "components/Modal/AddAuctionModal/AddAuctionModal";

export interface CreatedProductProps {
    item: Product;
    profileID: string;
}

export const CreatedProduct = ({ item, profileID }: CreatedProductProps) => {
    const dispatch = useAppDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const user = useAppSelector((state) => state.user);
    const activeProfile = useAppSelector((state) => state.activeProfile.activeProfile?._id);

    const handleDelete = async () => {
        if (activeProfile === item.ownerID) {
            await deleteProduct(item._id);
            await dispatch(fetchUserProducts(profileID));
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img className={styles.image} src={item.productImageUrl} alt="product" />
                {activeProfile === item.ownerID &&
                    activeProfile !== undefined &&
                    user.userID !== "" && (
                        <div className={styles.imageHoverSection}>
                            <div className={styles.imageHoverContainer}>
                                <button
                                    className={styles.deleteButton}
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                                <div className={styles.startAuction}>
                                    <button
                                        type="button"
                                        className={styles.startAuctionButton}
                                        onClick={() => setIsModalVisible(true)}
                                    >
                                        <span>Start auction!</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            <span className={styles.productName}>{item.productName}</span>
            <span className={styles.productDescription}>{item.productDescription}</span>
            {isModalVisible && activeProfile !== undefined && (
                <Modal
                    visible={isModalVisible}
                    onClose={() => {
                        setIsModalVisible(false);
                    }}
                    title="Start new auction!"
                >
                    <AddAuctionModal
                        activeProfile={activeProfile}
                        userID={user.userID}
                        product={item}
                    />
                </Modal>
            )}
        </div>
    );
};
