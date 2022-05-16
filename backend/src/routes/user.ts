import express from "express";
import { body } from "express-validator";
const router = express.Router();
const user = require("../controller/user");

router.get("/", user.getAllUsers);
router.get("/logged", user.getLoggedUser);
router.get("/:id", user.getUser);
router.post(
    "/register",
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isLength({ min: 3 }),
    body("username").notEmpty().isLength({ min: 3 }),
    user.registerUser
);

router.post("/login", user.loginUser);
router.post("/logout", user.logoutUser);

module.exports = router;
