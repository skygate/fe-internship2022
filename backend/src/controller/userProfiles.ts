import { Request, Response } from "express";
import profile from "../models/profile";

module.exports.getProfiles = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.user === undefined) return res.status(401).json({ message: "Not authenticated" });
    try {
        const foundProfiles = await profile.find({ userID: req.params.userID }).exec();
        res.status(200).json(foundProfiles);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
