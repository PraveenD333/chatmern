import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: "No Token Provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!decode) {
            return res.status(401).json({ message: "Unauthorized-Invalid Token" });
        }
        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("Error in auth middleware", error);
        return res.status(500).json({ message: "Server error" });
    }

}