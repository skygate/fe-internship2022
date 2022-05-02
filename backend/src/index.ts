import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import uniqid from "uniqid";
import passport from "passport";

const app: Express = express();
dotenv.config();
const port = process.env.PORT;

//routes
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const listingRoute = require("./routes/listing");

app.use(cors());
app.use(express.json());
app.use("/products", productRoute);
app.use("/user", userRoute);
app.use("/listing", listingRoute);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
