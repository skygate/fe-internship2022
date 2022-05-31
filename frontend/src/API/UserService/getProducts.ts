import { AxiosResponse } from "axios";
import { Product } from "interfaces/product";
import axiosInstance from "services/axios";

export const getUsersProducts = async (profileID: string) => {
    const response: AxiosResponse<Product[]> = await axiosInstance.get(
        `/products/profile/${profileID}`
    );
    return response.data;
};
