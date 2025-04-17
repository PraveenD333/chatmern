import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../Models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Email is not valid' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: 'User not created' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error);
        return res.status(500).json({ message: 'Server error' });

    }

}

export const logout = (req, res) => {
    try {
        //  res.cookie("jwt", "", { maxAge: 0 });
         res.clearCookie("jwt")
        return res.status(200).json({ message: "Logout success" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: 'Server error' });

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        
        
        res.status(200).json(updateUser)

    } catch (error) {
        console.log("Error in Update Profile:", error);
        res.status(500).json({message: "Internal Server Error" })
    };
}

export const checkAuth =(req, res) => {
try {
    res.status(200).json(req.user)
} catch (error) {
    console.log("Error in CheckAuth Controller",error);
    res.status(500).json({message:"Internal Server Error"})
}

}