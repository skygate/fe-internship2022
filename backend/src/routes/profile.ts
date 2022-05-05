import express from "express";
const router = express.Router();

const profile = require("../controller/profile");

router.get("/", profile.getProfiles);
router.post("/:userID", profile.addProfile);
router.post("/edit/:id", profile.editProfile);

module.exports = router;
