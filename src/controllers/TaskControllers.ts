import { Request, Response } from 'express';
import { badRequest, created, serverError } from '../views';
import TaskModel from '../models/Tasks';


export async function addTaskController(req: Request, res: Response) {
    try {
        const { user_id } = res.locals;
        const { title, desc, due_date } = req.body;
        
        if (!title || !desc || !due_date || !user_id) {
            badRequest(res);
            return;
        }
        
        // Due Date is to be in YYYY-MM-DD format

        const currTime = new Date().getTime();
        const dueDateTime = new Date(due_date).getTime();
        if (!dueDateTime) {
            badRequest(res);
            return;
        }
        
        const daysLeft = (dueDateTime - currTime) / (1000 * 60 * 60 * 24);
        if (daysLeft < 0) {
            badRequest(res);
            return;
        }

        const currDate = new Date();
        const created_at = currDate.getFullYear() + "-" + String(currDate.getMonth() + 1) + "-" + currDate.getDate();

        let priority = 0;
        if (daysLeft > 4)
            priority = 3
        else if (daysLeft > 2)
            priority = 2
        else if (daysLeft)
            priority = 1            

        const status = "DONE";
        const no_of_subtasks = 0;

        const taskData = { title, desc, due_date, user_id, created_at, priority, status, no_of_subtasks }
        const newTask = new TaskModel(taskData);
        const taskStatus = await newTask.save();

        created(res, {taskStatus, message: "Task Added Successfully"});

    } catch(err) {
        serverError(res, err)
    }
}