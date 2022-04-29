import { Request, Response } from "express";

let productsArray = new Array(20);

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

module.exports.getAllProducts = (req: Request, res: Response) => {
    res.json(productsArray);
};

module.exports.getProduct = (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    productsArray.find((item) => item.productId === `productId${id}`)
        ? res.json(productsArray[id])
        : res.send("Nie ma takiego produktu");
};
export default productsArray;

module.exports.addProduct = (req: Request, res: Response) => {
    const product = req.body;
    if (!product) {
        res.status(400).json({ errorMessage: "Data has missing properties" });
    }
    product.productId = `productId${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    productsArray.push(product);
    res.status(200).json({ errorMessage: "Successfully added product" });
};

module.exports.deleteProduct = (req: Request, res: Response) => {
    if (!req.body || !productsArray.find((product) => product.productId === req.body.productId)) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    }

    productsArray = productsArray.filter((product) => product.productId !== req.body.productId);

    res.status(200).json({ errorMessage: "Successfully deleted product" });
};

module.exports.editProduct = (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).json({ errorMessage: "Rosources not found" });
    }

    let index = productsArray.findIndex((product) => product.productId === req.body.productId);

    req.body.productName
        ? (productsArray[index].productName = req.body.productName)
        : (productsArray[index].productName = productsArray[index].productName);
    req.body.productDescription
        ? (productsArray[index].productDescription = req.body.productDescription)
        : (productsArray[index].productDescription = productsArray[index].productDescription);
    req.body.productCategory
        ? (productsArray[index].productCategory = req.body.productCategory)
        : (productsArray[index].productCategory = productsArray[index].productCategory);
    req.body.productImageUrl
        ? (productsArray[index].productImageUrl = req.body.productImageUrl)
        : (productsArray[index].productImageUrl = productsArray[index].productImageUrl);

    res.status(200).json({ errorMessage: "Succesfully changed product" });
};
