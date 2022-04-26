import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uniqid from 'uniqid';
const app: Express = express();
dotenv.config();
const port = process.env.PORT;

//routes
const productRoute = require('./routes/product');

app.use(cors());
app.use('/products', productRoute);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
