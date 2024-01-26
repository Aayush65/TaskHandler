import { ObjectId } from "mongodb";
import TaskModel from "../models/Tasks"
import makeCall from "../utils/makeCall";
import UserModel from "../models/Users";


export default async function dailyReminders() {
    const priorityMap: { [key: number]: number } = {0: 0, 2: 1, 4: 2}

    const pipeline = [
        { $project: { user_id: 1, leftDays: { $ceil: { $divide: [{ $subtract: [{ $toDate: "$due_date" }, new Date()] }, 86400000] } } } },
        { $match: { leftDays: { $in: Object.keys(priorityMap).map((e) => parseInt(e)) } } },
    ]

    const tasksToUpdate = await TaskModel.aggregate(pipeline);

    const bulkOperations = tasksToUpdate.map(task => ({
        updateOne: {
            filter: { _id: new ObjectId(task._id) },
            update: { $set: { priority: priorityMap[task.leftDays as number] } }
        }
    }));

    await TaskModel.bulkWrite(bulkOperations);

    const uniqueUsers: { [key: string]: number }  = {};
    tasksToUpdate.forEach(element => {
       uniqueUsers[element.user_id] = element.leftDays; 
    });

    const pipeline2 = [
        { $match: { _id: { $in: Object.keys(uniqueUsers).map((e) => new ObjectId(e)) } } },
        { $project: { _id: { $toString: "$_id" }, phone_number: 1 } },
    ]

    const allPhones = await UserModel.aggregate(pipeline2);
    allPhones.forEach(element => {
        makeCall(element.phone_number, "Complete your tasks quicky");
        // console.log(element.phone_number, "Complete your tasks quicky");
    })
}