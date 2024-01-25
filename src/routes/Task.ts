import { Router } from 'express';
import { addTaskController, deleteTasksController, getAllTasksController, updateTaskController } from '../controllers/TaskControllers';

export const router = Router();

router.get("/", getAllTasksController);
router.post("/", addTaskController);
router.put("/", updateTaskController);
router.delete("/", deleteTasksController);