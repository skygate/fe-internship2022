import { Request, Response } from "express";
import categories from "../models/categories";

export const addCategory = async (req: Request, res: Response) => {
    const { categoryName } = req.body;
    const newCategory = new categories({
        categoryName: categoryName,
    });
    try {
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    const allCategories = async () => {
        try {
            const categoriesList = await categories.find();
            res.status(200).json(categoriesList);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
    const oneCategory = async () => {
        try {
            const category = await categories.findById(req.query.id);
            res.status(200).json(category);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
    req.query.id ? oneCategory() : allCategories();
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        categories.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: "Category was succesfully deleted" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
