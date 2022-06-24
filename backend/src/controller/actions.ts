import { Request, Response } from "express";
import actions from "../models/actions";

export const fullInfoActions = async () => {
    try {
        const actionsWithInfo = await actions
            .find()
            .populate({
                path: "profileID",
                select: "profilePicture profileName",
            })
            .populate("objectID")
            .populate({ path: "objectID.productID" });
        console.log(actionsWithInfo);
        // res.status(200).json(actionsWithInfo);
    } catch (error: any) {
        // res.status(404).json({ message: error.message });
    }
};
