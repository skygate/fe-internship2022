import express from "express";
const router = express.Router();
const user = require("../controller/user");

router.get("/", user.getAllUsers);
router.get("/:id", user.getUser);

module.exports = router;
