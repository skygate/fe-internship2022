import axiosInstance from "services/axios";

export const deleteProduct = async (productID: string) => {
    return axiosInstance.delete(`/products/${productID}`);
};
