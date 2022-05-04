import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import user from "../models/users";
const initializePassport = require("../passport-config");

const usersArray = new Array(1);

interface User {
    username: string;
    email: string;
    password: string;
}

//FUNKCJA DO GENEROWANIA BAZY USERÓW

// const createUsersArray = async () => {
//     for (let i = 0; i < 20; i++) {
//         const newUser = new user({
//             userID: Date.now().toString() + i,
//             username: `ExampleUser${i}`,
//             email: `mail${i}@mail.pl`,
//             password: await bcrypt.hash(`password${i}`, 10),
//         });

//         newUser.save();
//     }
// };

// createUsersArray();

initializePassport(
    passport,
    (email: string) => user.findOne({ email: email }),
    (id: string) => user.findById(id)
);

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
        userID: Date.now().toString(),
        username: username,
        email: email,
        password: hashedPassword,
    });

    try {
        newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.loginUser = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
});

// const checkIfAuthenticated = (req: Request, res: Response, next: () => void) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.send("authenticated");
// };

// const checkIfNotAuthenticated = (req: Request, res: Response, next: () => void) => {
//     if (req.isAuthenticated()) {
//         return res.send("not authenticated");
//     }
//     next();
// };
