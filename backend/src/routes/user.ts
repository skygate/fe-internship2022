import express, { Request, Response } from "express";
import { check, body, validationResult } from "express-validator";
const router = express.Router();
const user = require("../controller/user");

router.get("/", user.getAllUsers);
router.get("/:id", user.getUser);
router.post(
    "/register",
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isLength({ min: 3 }),
    body("username").notEmpty().isLength({ min: 3 }),
    user.registerUser
);
router.post("/login", user.loginUser);

module.exports = router;
