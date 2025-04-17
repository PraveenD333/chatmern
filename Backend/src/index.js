import express from 'express'
import authRoutes from './Routes/auth.route.js'
import messageRoutes from './Routes/message.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import dotenv from 'dotenv';
import { app,server } from './lib/socket.js';
dotenv.config();
const port=process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://chatmern-six.vercel.app",
    credentials:true,
}))
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


server.listen(port,()=>{
    console.log(`Server is on.....${port}`);
    connectDB();
})