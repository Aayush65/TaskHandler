import { Request, Response } from 'express';
import { badRequest, created, notFound, serverError, statusOkay } from '../views';
import SubTaskModel from '../models/SubTasks';
import { ObjectId } from 'mongodb';


export async function getAllSubTasksController(req: Request, res: Response) {
    try {
        const { user_id } = res.locals;
        const { task_id } = req.body;
        if ( !user_id || !ObjectId.isValid(user_id) ) {
            throw new Error("User_id not present/valid");
        }
        if ( task_id && !ObjectId.isValid(task_id) ) {
            badRequest(res);
            return;
        }
        let toFind = {}
        if (task_id) {
            toFind = { task_id }
        }
        const subtasks = await SubTaskModel.find({ user_id, deleted_at: { $exists: false }, ...toFind });
        statusOkay(res, subtasks);

    } catch(err) {
        serverError(res, err)
    }
}

export async function addSubTaskController(req: Request, res: Response) {
    try {
        const { user_id } = res.locals;
        const { title, desc, task_id } = req.body;
        
        if ( !user_id || !ObjectId.isValid(user_id) ) {
            throw new Error("User_id not present/valid");
        }
        if (!title || !desc || !task_id || !ObjectId.isValid(task_id)) {
            badRequest(res);
            return;
        }
        
        const currDate = new Date();
        const created_at = currDate.getFullYear() + "-" + String(currDate.getMonth() + 1) + "-" + currDate.getDate();
        const status = 0;

        const newTask = new SubTaskModel({ title, desc, task_id, user_id, status, created_at });
        const subtaskStatus = await newTask.save();

        created(res, {subtaskStatus, message: "Subtask Added Successfully"});

    } catch(err) {
        serverError(res, err)
    }
}

export async function updateSubTaskController(req: Request, res: Response) {
    try {
        const { _id, status } = req.body;
        if ( !_id || !ObjectId.isValid(_id) || typeof status !== "number"  || status * status !== status ) {
            badRequest(res);
            return;
        }

        const { user_id } = res.locals;
        if ( !user_id || !ObjectId.isValid(user_id) ) {
            throw new Error("User_id not present");
        }

        let toUpdate = {}
        if (status !== undefined)
            toUpdate = { status }

        const response = await SubTaskModel.findOneAndUpdate( { _id, user_id }, { $set: { updated_at: new Date(), ...toUpdate }}, { new: true })
        if (!response) {
            notFound(res);
            return;
        }
        statusOkay(res, { response, message: "Subtask updated successfully" });

    } catch(err) {
        serverError(res, err);
    }
}

export async function deleteSubTasksController(req: Request, res: Response) {
    try {
        const { _id } = req.body; 
        if (!ObjectId.isValid(_id)) {
            badRequest(res);
            return;
        }
        const { user_id } = res.locals;
        if ( !user_id || !ObjectId.isValid(user_id) ) {
            throw new Error("User_id not present");
        }
        const response = await SubTaskModel.findOneAndUpdate({_id, user_id }, { deleted_at: new Date() });
        if (!response || response.deleted_at ) {
            notFound(res);
            return;
        }
        statusOkay(res, { response, message: "Subtask deleted successfully" });
    } catch(err) {
        serverError(res, err)
    }
}