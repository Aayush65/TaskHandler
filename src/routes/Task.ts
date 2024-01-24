import { Router } from 'express';
import { Request, Response } from 'express';
import { addTaskController } from '../controllers/TaskControllers';

export const router = Router();

router.get("/", (req: Request, res: Response) => res.send("Hello World!!"));
router.post("/", addTaskController);
router.put("/", (req: Request, res: Response) => res.send("Hello World!!"));
router.delete("/", (req: Request, res: Response) => res.send("Hello World!!"));