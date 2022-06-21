import { Request, Response } from "express";
import profile from "../models/profile";

interface Following {
    following: { profileID: Object };
}

interface Follower {
    follower: { profileID: Object };
}

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
        const foundProfile = await profile
            .findById(id)
            .populate({
                path: "followers.follower.profileID",
                select: "profilePicture profileName",
            })
            .populate({
                path: "following.following.profileID",
                select: "profilePicture profileName",
            });
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

module.exports.follow = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const activeProfileID = req.body.id;
    const followingProfileID = req.params.id;

    try {
        const followingProfile = await profile.findById(followingProfileID);
        if (
            followingProfile.followers.find(
                (element: Follower) => element.follower.profileID.toString() === activeProfileID
            )
        )
            throw new Error("You are already following this profile");
        const newFollowersProfile = { follower: { profileID: activeProfileID } };
        followingProfile.followers.push(newFollowersProfile);
        const activeProfile = await profile.findById(activeProfileID);
        if (
            activeProfile.following.find(
                (element: Following) =>
                    element.following.profileID.toString() === followingProfileID
            )
        )
            throw new Error("You are already following this profile");
        const newFollowingProfile = { following: { profileID: followingProfileID } };
        activeProfile.following.push(newFollowingProfile);
        followingProfile.save();
        activeProfile.save();
        res.status(200).send("Followed");
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

module.exports.unfollow = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const activeProfileID = req.body.id;
    const followingProfileID = req.params.id;

    try {
        const followingProfile = await profile.findById(followingProfileID);
        if (
            !followingProfile.followers.find(
                (element: Follower) => element.follower.profileID.toString() === activeProfileID
            )
        )
            return new Error("You are not following this profile yet");
        followingProfile.followers = followingProfile.followers.filter(
            (element: Follower) => element.follower.profileID.toString() !== activeProfileID
        );
        await followingProfile.save();
        const activeProfile = await profile.findById(activeProfileID);
        if (
            !activeProfile.following.find(
                (element: Following) =>
                    element.following.profileID.toString() === followingProfileID
            )
        )
            return new Error("You are not following this profile yet");
        activeProfile.following = activeProfile.following.filter(
            (element: Following) => element.following.profileID.toString() !== followingProfileID
        );

        await activeProfile.save();
        res.status(200).send("Unfollowed");
    } catch (error: any) {
        res.status(404).send(error.message);
    }
};
