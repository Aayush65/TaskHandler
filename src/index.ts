import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { TaskRouter, SubTaskRouter } from './routes/';

config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/task", TaskRouter);
app.use("/subtask", SubTaskRouter);

app.get("/", (req: Request, res: Response) => res.send("Hello World!!"));

app.listen(process.env.PORT || 3000, () => console.log(`Listening on Port ${process.env.PORT || 3000}`));