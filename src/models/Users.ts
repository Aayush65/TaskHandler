import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // id is redundant here, because mongodb creates an _id for each document (entry)

    phone_number: Number,
    priority: Number,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;