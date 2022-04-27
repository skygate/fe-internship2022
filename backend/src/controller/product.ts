import { Request, Response } from 'express';

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
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			productImageUrl: `https://picsum.photos/id/${Math.round(
				Math.random() * 100
			)}/200`,
			productCategory: 'category',
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
		: res.send('Nie ma takiego produktu');
};
