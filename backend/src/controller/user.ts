import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "passport";
import user from "../models/users";
import profile from "../models/profile";

module.exports.getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

const confirmUser = async (id: string, password: string) => {
    const userAccount = await user.findOne({ _id: id });
    if (userAccount == null) return false;
    try {
        const response = await bcrypt.compare(password, userAccount.password);
        return response;
    } catch (e: any) {
        return e;
    }
};

module.exports.confirmUser = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    const id = req.user.userID._id;
    const password = req.body.password;
    await confirmUser(id, password)
        .then((data) => {
            if (!data) {
                throw new Error("Password incorect.");
            }
            res.status(200).json(data);
        })
        .catch((err: Error) => {
            res.status(300).json({ message: err.message });
        });
};

module.exports.getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const foundUser = await user.findById(id);
        res.status(200).json(foundUser);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const existingEmail = await user.findOne({ email: email });
    const existingUsername = await user.findOne({ username: username });

    if (existingEmail != null || existingUsername != null) {
        res.status(409).json({ message: "User already exists" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
        username: username,
        email: email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        const { _id } = await user.findOne({ email: email });
        const newProfile = new profile({
            userID: _id,
            profileName: username,
            about: "Default about",
            profilePicture:
                "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
            coverPicture:
                "https://galaktyczny.pl/wp-content/uploads/2021/08/windows-xp-wallpaper-tapeta.jpg",
            websiteUrl: "",
            instagramUrl: "",
            twitterUrl: "",
            facebookUrl: "",
            following: [],
            followers: [],
            joinDate: new Date(),
        });
        newProfile.save();
        res.status(201).json({ message: "User added succesfully" });
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.loginUser = (req: Request, res: Response, next: any) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");

    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) {
            res.status(400).json({ message: "User doesn't exist" });
            return;
        }
        req.logIn(user, (err) => {
            if (err) throw err;
            res.status(200).json(req.user);
        });
    })(req, res, next);
};

module.exports.logoutUser = function (req: Request, res: Response) {
    req.logout();
    res.status(200).json({ message: "User logged out" });
};

module.exports.getLoggedUser = async (req: Request, res: Response) => {
    if (req.user === undefined)
        return res.status(401).json({ message: "User not authenticated", userID: "" });
    res.status(200).json(req.user);
};
