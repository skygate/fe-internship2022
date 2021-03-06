import { Request, Response } from "express";
import product from "../models/product";
import actions from "../models/actions";

let productsArray = new Array(20);

interface Product {
    productId: string;
    ownerID: string;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productCategory: string;
}

const createProductsArray = (arr: Product[]) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = {
            productId: `productId${i}`,
            ownerID: `owner_${i}`,
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

export const getUsersProducts = async (req: Request, res: Response) => {
    try {
        const foundProducts = await product.find({ ownerID: req.params.id }).exec();
        res.status(200).json(foundProducts);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const addProduct = async (req: Request, res: Response) => {
    const { productName, productDescription, productImageUrl, productCategory, ownerID } = req.body;
    const newProduct = new product({
        ownerID,
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

export default productsArray;

module.exports.deleteProduct = async (req: Request, res: Response) => {
    try {
        await product.findByIdAndDelete(req.params.id).exec();
        res.status(204).json({ message: "Product deleted" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.editProduct = async (req: Request, res: Response) => {
    try {
        const foundProduct = await product.findById(req.body.productID);
        const purchaseAction = new actions({
            profileID: req.body.ownerID,
            date: new Date(),
            offer: req.body.offer,
            verb: "purchased",
            objectID: foundProduct._id,
            objectModel: "Products",
        });
        const sellAction = new actions({
            profileID: foundProduct.ownerID,
            date: new Date(),
            offer: req.body.offer,
            verb: "sold",
            objectID: foundProduct._id,
            objectModel: "Products",
        });
        const isPurchase = req.body.ownerID !== foundProduct.ownerID;

        for (const key in foundProduct) {
            foundProduct[key] = req.body[key] || foundProduct[key];
        }
        await foundProduct.save();
        if (isPurchase) {
            await purchaseAction.save();
            await sellAction.save();
        }
        res.status(200).json({ errorMessage: "Succesfully changed product" });
    } catch (error) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    }
};
