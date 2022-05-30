import { AxiosResponse } from "axios";
import { Product } from "interfaces/product";
import axiosInstance from "services/axios";

export const getUsersProducts = async (profileID: string) => {
    try {
        const response: AxiosResponse<Product[]> = await axiosInstance.get(
            `/products/profile/${profileID}`
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
