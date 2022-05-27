import { Product } from "interfaces/product";
import axiosInstance from "services/axios";

export const addProduct = async (item: Product) => {
    try {
        const response = axiosInstance.post(`/products`, JSON.stringify(item));
        return response;
    } catch (error) {
        throw new Error("Adding new product failed");
    }
};
