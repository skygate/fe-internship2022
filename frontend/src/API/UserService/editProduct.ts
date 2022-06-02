import axiosInstance from "services/axios";

interface ProductData {
    ownerID?: String;
    productName?: String;
    productDescription?: String;
    productImageUrl?: String;
    productCategory?: String;
}

export const editProduct = async (productData: ProductData) => {
    return axiosInstance.patch(`/products/`, productData);
};
