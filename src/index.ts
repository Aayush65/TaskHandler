import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { TaskRouter, SubTaskRouter } from './routes/';
import mongoose from 'mongoose';

config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/task", TaskRouter);
app.use("/subtask", SubTaskRouter);

app.get("/", (req: Request, res: Response) => res.send("Hello World!!"));

mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        console.clear();
        console.log(`Connected to MongoDB and Listening on Port ${process.env.PORT}`);
        app.listen(process.env.PORT);
    })
    .catch(console.log)