import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    const { username, email , password , role } = req.body;
    try{
        const exsistingUser = await User.findOne({ email});
        if(exsistingUser){
            return res.status(400).json({message: "User already exsists"});
        }
        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
        })

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "User created successfully",
           
            token,
             user: {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req , res) => {
    const { email , password} = req.body;
    try{
        const user = await User.findOne({ email});
    if(!user){
        return res.status(401).json({message: "User not found"})

    }
    const isPasswordCorrect = await bcrypt.compare(password , user.password);
    if(!isPasswordCorrect){
        return res.status(401).json({message: "Invalid password"});
    }
    const token = jwt.sign({ userId: user._id}, JWT_SECRET,{ expiresIn: "7d" });
    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        token,
    });
   
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}