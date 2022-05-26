import express from "express";
const multer = require("multer");
const router = express.Router();

const upload = require("../controller/upload");

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, "./uploads");
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/").reverse()[0]);
    },
});

const uploadMulter = multer({ storage: storage });
router.post("/", uploadMulter.single("file"), upload.uploadFile);

module.exports = router;
