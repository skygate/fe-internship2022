import { Request, Response } from "express";
const fs = require("fs");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

module.exports.uploadFile = (req: Request, res: Response) => {
    cloudinary.uploader
        .upload(req.file?.path, {
            resource_type: "image",
        })
        .then((result: any) => {
            fs.unlink(req.file?.path, (err: any) => {
                if (err) {
                    res.status(400).json({ message: "Uploading failed" });
                    return;
                }
            });
            res.status(200).json({ message: result.url });
        })
        .catch((error: any) => res.status(400).json({ message: JSON.stringify(error, null, 2) }));
};
