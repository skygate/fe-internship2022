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

app.use(cors());
app.use("/products", productRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
