import { Request, Response } from "express";
// import ExampleUserList from "../constants/ExampleUserList";
import bcrypt from "bcrypt";
import passport from "passport";
const initializePassport = require("../passport-config");

const usersArray = new Array(1);

interface User {
    userID: number;
    username: string;
    email: string;
    password: string;
    // about: string;
    // websiteUrl: string;
    // profilePicture: string;
    // coverPicture: string;
}

const createUsersArray = async (arr: User[]) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = {
            userID: i,
            username: `ExampleUser${i}`,
            email: `e${i}@e`,
            password: await bcrypt.hash(`password${i}`, 10),
        };
    }
};

createUsersArray(usersArray);

initializePassport(
    passport,
    (email: string) => usersArray.find((user) => user.email === email),
    (id: number) => usersArray.find((user) => user.userID === id)
);

module.exports.getAllUsers = (req: Request, res: Response) => {
    res.json(usersArray);
};

module.exports.getUser = (req: Request, res: Response) => {
    const user = usersArray.find((User) => User.userID == req.params.id);
    user ? res.json(user) : res.send("user doesn`t exist");
};

module.exports.registerUser = async (req: Request, res: Response) => {
    const existingUser = usersArray.find((user: User) => user.email == req.body.email);

    if (existingUser != null) {
        res.send("User already exists");
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        usersArray.push({
            userID: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        res.send("udalo sie");
    } catch {
        res.send("nie udało się");
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
