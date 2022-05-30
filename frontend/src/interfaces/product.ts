export interface Product {
    ownerID: string;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productCategory: string;
}

export interface CreatedProductProps {
    item: Product;
}
