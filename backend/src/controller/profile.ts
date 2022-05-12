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

module.exports.getProfile = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    // Handling authentication on every fetch
    // if (req.user === undefined) return res.status(401).json({message: "Not authenticated"});
    const { id } = req.params;
    try {
        const foundProfile = await profile.findById(id);
        res.status(200).json(foundProfile);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.addProfile = async (req: Request, res: Response) => {
    const {
        about,
        websiteUrl,
        profilePicture,
        coverPicture,
        profileName,
        instagramUrl,
        twitterUrl,
        facebookUrl,
    } = req.body;
    const { userID } = req.params;

    const newProfile = new profile({
        userID: userID,
        profileName: profileName,
        about: about,
        websiteUrl: websiteUrl,
        profilePicture: profilePicture,
        coverPicture: coverPicture,
        instagramUrl: instagramUrl,
        twitterUrl: twitterUrl,
        facebookUrl: facebookUrl,
        joinDate: new Date(),
        following: new Array(),
        followers: new Array(),
    });

    try {
        newProfile.save();
        res.status(200).json(newProfile);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.editProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        about,
        websiteUrl,
        profilePicture,
        coverPicture,
        instagramUrl,
        facebookUrl,
        twitterUrl,
        profileName,
    } = req.body;

    try {
        await profile.findByIdAndUpdate(
            id,
            {
                about: about,
                websiteUrl: websiteUrl,
                profilePicture: profilePicture,
                coverPicture: coverPicture,
                instagramUrl: instagramUrl,
                facebookUrl: facebookUrl,
                twitterUrl: twitterUrl,
                profileName: profileName,
            },
            { new: true }
        );
        res.status(200).send("ok");
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.deleteProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await profile.findByIdAndDelete(id);
        res.status(200).send("deleted");
    } catch (error) {
        res.status(404).send("not working");
    }
};
