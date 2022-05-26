import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import uniqid from "uniqid";
const passport = require("passport");
const session = require("express-session");
dotenv.config();
const port = process.env.PORT;
const mongo = process.env.MONGO || "";
const cloudinary = require("cloudinary").v2;

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongo,
            collectionName: "sessions",
            autoRemove: "interval",
            autoRemoveInterval: 60 * 2, // 2h
        }),
        cookie: {
            maxAge: 2 * 60 * 60 * 1000, //2h
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
require("./passport-config");

// IMPORT ROUTES
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const auctionsRoute = require("./routes/auctions");
const profileRoute = require("./routes/profile");
const categoriesRoute = require("./routes/categories");
const userProfilesRoute = require("./routes/userProfiles");
const uploadRoute = require("./routes/upload");

// USE ROUTES
app.use("/products", productRoute);
app.use("/user", userRoute);
app.use("/auctions", auctionsRoute);
app.use("/profiles", profileRoute);
app.use("/categories", categoriesRoute);
app.use("/userProfiles", userProfilesRoute);
app.use("/upload", uploadRoute);

// CONNECT MONGO
mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        app.listen(port, () => console.log(`Server Running on Port: http://localhost:${port}`))
    )
    .catch((error: any) => console.log(`${error} did not connect`));
// CONNECT CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
