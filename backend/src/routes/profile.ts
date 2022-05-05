import express from "express";
const router = express.Router();

const profile = require("../controller/profile");

router.get("/", profile.getProfiles);
router.get("/:id", profile.getProfile);
router.post("/:userID", profile.addProfile);
router.patch("/:id", profile.editProfile);
router.delete("/:id", profile.deleteProfile);

module.exports = router;
