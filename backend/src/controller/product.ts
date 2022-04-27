import { Request, Response } from 'express';
import { ExampleNFTList } from '../constants/ExampleNFTList';

module.exports.getAllProducts = (req: Request, res: Response) => {
	res.json(ExampleNFTList);
};
