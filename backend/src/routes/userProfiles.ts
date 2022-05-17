import express from "express";
const router = express.Router();
const userProfiles = require("../controller/userProfiles");

router.get("/:userID", userProfiles.getProfiles);

module.exports = router;
