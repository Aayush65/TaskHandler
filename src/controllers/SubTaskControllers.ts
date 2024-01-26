import { Request, Response } from 'express';
import { badRequest, created, notFound, serverError, statusOkay } from '../views';
import SubTaskModel from '../models/SubTasks';
import { ObjectId } from 'mongodb';
import TaskModel from '../models/Tasks';


const statusCondition = (change: number) => { return { 
    $switch: {
        branches: [
            { case: { $eq: [ { $sum: ["$completed_subtasks",  change]}, "$no_of_subtasks"] }, then: "DONE"},
            { case: { $gte: [{ $sum: ["$completed_subtasks",  change]}, 1] }, then: "IN_PROGRESS"},
            { case: { $eq: [{ $sum: ["$completed_subtasks",  change]}, 0] }, then: "TODO"}
        ],
        default: "Unknown"
    }
}}

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

        const taskUpdate = await TaskModel.findOneAndUpdate({ _id: task_id, user_id }, [{ $inc: { no_of_subtasks: 1 }}]);
        if (!taskUpdate) {
            notFound(res);
            return;
        }
        const newSubTask = new SubTaskModel({ title, desc, task_id, user_id, status, created_at });
        const subtaskStatus = await newSubTask.save();

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

        const response = await SubTaskModel.findOneAndUpdate( { _id, user_id }, [{ $set: { 
            updated_at: { $cond: [ { $ne: [status, "$status"] }, new Date(), "$updated_at"]}, status }}] );

        if (!response) {
            notFound(res);
            return;
        }
        if (response.status === status){
            statusOkay(res, { message: "Nothing to change" });
            return;
        }

        await TaskModel.updateOne({ _id: response.task_id, user_id }, [{ $set: {
            completed_subtasks: {
                $cond: [ { $eq: [status, 1] }, { $add: ["$completed_subtasks",  1]}, { $add : ["$completed_subtasks", -1]} ]
            },
            status: statusCondition(status ? 1: -1),
        }}]);
        statusOkay(res, { message: "Subtask updated successfully" });

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

        await TaskModel.findOneAndUpdate({ _id: response.task_id, user_id }, [{ $inc: { no_of_subtasks: -1}, 
            $set: {
                completed_subtasks: {
                    $cond: {
                        if: { $eq: [response.status, 1] },
                        then: { $add: ["$completed_subtasks", -1] },
                        else: "$completed_subtasks" }
                    },
                status: statusCondition(response.status ? -1 : 1)
        }}]);
        
        statusOkay(res, { response, message: "Subtask deleted successfully" });
    } catch(err) {
        serverError(res, err)
    }
}