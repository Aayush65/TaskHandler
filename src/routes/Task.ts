import { Router } from 'express';
import { Request, Response } from 'express';

export const router = Router();

router.get("/", (req: Request, res: Response) => res.send("Hello World!!"));
router.post("/", (req: Request, res: Response) => res.send("Hello World!!"));
router.put("/", (req: Request, res: Response) => res.send("Hello World!!"));
router.delete("/", (req: Request, res: Response) => res.send("Hello World!!"));