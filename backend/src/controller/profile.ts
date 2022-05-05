import { Request, Response } from "express";
import profile from "../models/profile";

module.exports.getProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await profile.find();
        res.status(200).json(profiles);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.addProfile = async (req: Request, res: Response) => {
    const { about, websiteUrl, profilePicture, coverPicture } = req.body;
    const { userID } = req.params;

    const newProfile = new profile({
        userID: userID,
        about: about,
        websiteUrl: websiteUrl,
        profilePicture: profilePicture,
        coverPicture: coverPicture,
    });

    try {
        newProfile.save();
        res.status(201).json(newProfile);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.editProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { about, websiteUrl, profilePicture, coverPicture } = req.body;

    try {
        await profile.findByIdAndUpdate(
            id,
            {
                about: about,
                websiteUrl: websiteUrl,
                profilePicture: profilePicture,
                coverPicture: coverPicture,
            },
            { new: true }
        );
        res.status(201).send("ok");
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
