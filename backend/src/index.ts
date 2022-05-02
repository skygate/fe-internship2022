import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import uniqid from "uniqid";
const app: Express = express();
dotenv.config();
const port = process.env.PORT;

//routes
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const listingRoute = require("./routes/listing");
const loginRoute = require("./routes/login");
const registerROute = require("./routes/register");

app.use(cors());
app.use(express.json());
app.use("/products", productRoute);
app.use("/user", userRoute);
app.use("/listing", listingRoute);
app.use("/login", listingRoute);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
