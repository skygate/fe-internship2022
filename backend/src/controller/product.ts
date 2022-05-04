import { Request, Response } from "express";
import product from "../models/product";
const productsArray = new Array(20);

interface Product {
    productId: string;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productCategory: string;
}

const createProductsArray = (arr: Product[]) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = {
            productId: `productId${i}`,
            productName: `exampleName${i}`,
            productDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            productImageUrl: `https://picsum.photos/id/${Math.round(Math.random() * 100)}/200`,
            productCategory: "category",
        };
    }
};

createProductsArray(productsArray);

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await product.find();
        res.status(200).json(products);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const foundProduct = await product.findById(req.params.id).exec();
        res.status(200).json(foundProduct);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
export default productsArray;

export const addProduct = async (req: Request, res: Response) => {
    const { productName, productDescription, productImageUrl, productCategory } = req.body;
    const newProduct = new product({
        productName,
        productDescription,
        productImageUrl,
        productCategory,
    });
    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};
