import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subTaskSchema = new Schema({
    // id is redundant here, because mongodb creates an _id for each document (entry)
    
    task_id: Number,
    status: Number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
});

const SubTaskModel = mongoose.model("SubTask", subTaskSchema);

export default SubTaskModel;