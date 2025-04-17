import mongoose from "mongoose";

const usreSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    fullname: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",

    },
}, { timestamps: true }
);

const User = mongoose.model("User", usreSchema);

export default User;