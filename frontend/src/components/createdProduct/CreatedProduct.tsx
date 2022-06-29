import styles from "./createdProduct.module.scss";
import { Product } from "interfaces/product";
import { deleteProduct } from "API/UserService/product";
import { useAppDispatch, useAppSelector } from "store/store";
import { fetchUserProducts } from "store/userProducts";
import { useState } from "react";
import { Modal } from "components/Modal/Modal";
import { AddAuctionModal } from "components/Modal/AddAuctionModal/AddAuctionModal";
import { UserSelector } from "store/user";
import { ActiveProfileSelector } from "store/activeProfile";
import { LoadingToast, UpdateToast } from "components";

export interface CreatedProductProps {
    item: Product;
    profileID: string;
    setAuctions: () => void;
}

export const CreatedProduct = ({ item, profileID, setAuctions }: CreatedProductProps) => {
    const dispatch = useAppDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const user = useAppSelector(UserSelector);
    const activeProfile = useAppSelector(ActiveProfileSelector).activeProfile?._id;
    const isOwner = activeProfile === item.ownerID;

    const handleDelete = async () => {
        if (!isOwner) return;
        const deleteToast = LoadingToast("Deleting product...");
        if (!item._id) return;
        await deleteProduct(item._id)
            .then(() => UpdateToast(deleteToast, "Successfully deleted", "success"))
            .catch(() => UpdateToast(deleteToast, "Something went wrong", "error"))
            .finally(() => dispatch(fetchUserProducts(profileID)));
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img className={styles.image} src={item.productImageUrl} alt="product" />
                {isOwner && activeProfile !== undefined && user.userID !== "" && (
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
                        setAuctions={setAuctions}
                        isVisible={() => setIsModalVisible(false)}
                    />
                </Modal>
            )}
        </div>
    );
};
