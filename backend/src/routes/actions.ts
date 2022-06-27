import express from "express";
const router = express.Router();
const actions = require("../controller/actions");

router.get("/", actions.getAllActions);

module.exports = router;
