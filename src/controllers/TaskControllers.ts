import { Request, Response } from 'express';
import { badRequest, created, notFound, serverError, statusOkay } from '../views';
import TaskModel from '../models/Tasks';
import { ObjectId } from 'mongodb';


export async function getAllTasksController(req: Request, res: Response) {
    try {
        const { user_id } = res.locals;
        const tasks = await TaskModel.find({ user_id, deleted_at: { $exists: false } });
        statusOkay(res, tasks);

    } catch(err) {
        serverError(res, err)
    }
}

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

export async function updateTaskController(req: Request, res: Response) {
    try {
        const { _id, due_date, status } = req.body;
        if ( !_id || !ObjectId.isValid(_id) ) {
            badRequest(res);
            return;
        }
        if (status && !["TODO", "DONE"].includes(status)) {
            badRequest(res);
            return;
        }
        if (due_date && (!new Date(due_date).getTime() || new Date(due_date).getTime() <= new Date().getTime()) ) {
            badRequest(res);
            return;
        }

        const { user_id } = res.locals;
        let toUpdate = {}
        if (due_date)
            toUpdate = { due_date }
        if  (status)
            toUpdate = { ...toUpdate, status }

        const response = await TaskModel.findOneAndUpdate( { _id, user_id }, { $set: { updated_at: new Date(), ...toUpdate }})
        if (!response) {
            notFound(res);
            return;
        }
        statusOkay(res, { response, message: "Task updated successfully" });

    } catch(err) {
        serverError(res, err);
    }
}

export async function deleteTasksController(req: Request, res: Response) {
    try {
        const { _id } = req.body; 
        if (!ObjectId.isValid(_id)) {
            badRequest(res);
            return;
        }
        const { user_id } = res.locals;
        const response = await TaskModel.findOneAndUpdate({_id, user_id }, { deleted_at: new Date() });
        if (!response || response.deleted_at ) {
            notFound(res);
            return;
        }

        // delete all the subtasks of tasks

        statusOkay(res, { response, message: "Task deleted successfully" });
    } catch(err) {
        serverError(res, err)
    }
}