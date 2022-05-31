export interface Product {
    _id: string;
    ownerID: string;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productCategory: string;
}

export interface UsersProductsState {
    status: string;
    products: Product[] | [];
}
