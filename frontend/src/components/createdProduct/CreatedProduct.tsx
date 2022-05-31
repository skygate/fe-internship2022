import styles from "./createdProduct.module.scss";
import { Product } from "interfaces/product";

export interface CreatedProductProps {
    item: Product;
}

export const CreatedProduct = ({ item }: CreatedProductProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img className={styles.image} src={item.productImageUrl} alt="product" />
            </div>
            <span className={styles.productName}>{item.productName}</span>
            <span className={styles.productDescription}>{item.productDescription}</span>
        </div>
    );
};
