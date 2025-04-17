// import { Socket } from "socket.io";
import cloudinary from "../lib/cloudinary.js";
import Message from "../Models/message.model.js";
import User from "../Models/user.model.js";
import { getReceiverSocketId,io} from "../lib/socket.js";

export const getUserforSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error In GetUserforSidebar:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error In get Messages Controller:", error);
        res.status(500).json({ message: "Interal Server Error" });
    }

}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: reciverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl,
        })
        await newMessage.save();

        // todo:realtime functionality goes here => Socket.io
        const receiverSocketId = getReceiverSocketId(reciverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error In Send Messages Controller:", error);
        res.status(500).json({ message: "Interal Server Error" });
    }
}