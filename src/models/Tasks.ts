import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    // id is redundant here, because mongodb creates an _id for each document (entry)
    
    title: String,
    desc: String,
    due_date: String,
    user_id: String,
    
    no_of_subtasks: Number,
    completed_subtasks: Number,
    priority: Number,
    status: String,

    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
});

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;