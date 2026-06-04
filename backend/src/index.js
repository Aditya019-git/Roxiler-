import express from 'express';
import cors from 'cors';
import {PrismaClient}from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app=express();
const prisma=new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);

app.get('/',(req,res)=>{
    res.send("Roxiler Store Rating API is running with ES Modules!");
});

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});