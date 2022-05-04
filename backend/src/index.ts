import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import uniqid from "uniqid";



const mongoose = require("mongoose");

const app: Express = express();
dotenv.config();
const port = process.env.PORT;
const mongo = process.env.MONGO || "";

//routes
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const listingRoute = require("./routes/listing");

app.use(cors());
app.use(express.json());
app.use("/products", productRoute);
app.use("/user", userRoute);
app.use("/listing", listingRoute);



mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        app.listen(port, () => console.log(`Server Running on Port: http://localhost:${port}`))
    )
    .catch((error: any) => console.log(`${error} did not connect`));

