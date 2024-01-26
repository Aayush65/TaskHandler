import { Router } from 'express';
import { addSubTaskController, deleteSubTasksController, getAllSubTasksController, updateSubTaskController } from '../controllers/SubTaskControllers';

export const router = Router();

router.get("/", getAllSubTasksController);
router.post("/", addSubTaskController);
router.put("/", updateSubTaskController);
router.delete("/", deleteSubTasksController);