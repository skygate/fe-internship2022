import express from "express";
const router = express.Router();
const actions = require("../controller/actions");

router.get("/", actions.getAllActions);
router.get("/:id", actions.getProfileActions);
router.get("/following/:id", actions.getFollowingProfilesActions);

module.exports = router;
