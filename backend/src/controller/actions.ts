import { Request, Response } from "express";
import actions from "../models/actions";

export const getAllActions = async (req: Request, res: Response) => {
    try {
        const actionsWithInfo = await actions
            .find()
            .populate({
                path: "profileID",
                select: "profilePicture profileName",
            })
            .populate({
                path: "objectID",
                populate: [{ path: "_id" }],
            });

        res.status(200).json(actionsWithInfo);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
