import express from "express";
const router = express.Router();
const actions = require("../controller/actions");

router.post("/", actions.getAllActions);
router.post("/:id", actions.getProfileActions);
router.post("/following/:id", actions.getFollowingProfilesActions);

module.exports = router;
