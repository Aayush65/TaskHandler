import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subTaskSchema = new Schema({
    // id is redundant here, because mongodb creates an _id for each document (entry)
    
    title: String,
    desc: String, 

    task_id: String,
    user_id: String,
    status: Number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
});

const SubTaskModel = mongoose.model("SubTask", subTaskSchema);

export default SubTaskModel;