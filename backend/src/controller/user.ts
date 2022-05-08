import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import user from "../models/users";
import profile from "../models/profile";

//FUNKCJA DO GENEROWANIA BAZY USERÓW

// const createUsersArray = async () => {
//     for (let i = 0; i < 20; i++) {
//         const newUser = new user({
//             username: `ExampleUser${i}`,
//             email: `mail${i}@mail.pl`,
//             password: await bcrypt.hash(`password${i}`, 10),
//         });

//         await newUser.save();
//         const { _id } = await user.findOne({ username: `ExampleUser${i}` });
//         const newProfile = new profile({
//             userID: _id,
//             about: "",
//             websiteUrl: "",
//             profilePicture: "",
//             coverPicture: "",
//         });
//         await newProfile.save();
//     }
// };

// createUsersArray();

// initializePassport(
//     passport
//     // async (email: string) => {
//     //     const foundUser = await user.findOne({ email: email });
//     //     console.log(foundUser);
//     //     return foundUser;
//     // },
//     // async (id: string) => await user.findById(id)
// );

module.exports.getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
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
    console.log(req.body);
    const { email, username, password } = req.body;
    const existingEmail = await user.findOne({ email: email });
    const existingUsername = await user.findOne({ username: username });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (existingEmail != null || existingUsername != null) {
        res.send(`User already exists`);
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
            about: "",
            websiteUrl: "",
            profilePicture: "",
            coverPicture: "",
        });
        newProfile.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.loginUser = (req: Request, res: Response, next: any) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("user doesn't exist");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        req.logIn(user, (err) => {
            if (err) throw err;
            res.status(200).send(req.user);
        });
    })(req, res, next);
};
