import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // id is redundant here, because mongodb creates an _id for each document (entry)

    phone_number: {
        type: Number,
        unique: true,
    },
    priority: Number,

    // Adding pass to help in authentication and issuing JWT tokens
    pass: String,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;