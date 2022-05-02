import express, { Request, Response } from "express";
const router = express.Router();
const user = require("../controller/user");

router.get("/", user.getAllUsers);
router.get("/:id", user.getUser);
router.post("/register", user.registerUser);
router.post("/login", user.loginUser);

module.exports = router;
