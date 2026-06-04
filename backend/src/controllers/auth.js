import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma=new PrismaClient();

const register=async(req,res)=>{
    const{name,email,password,address}=req.body;

    try{
        const existingUser=await prisma.user.findUnique({where:{email}});
        if(existingUser){
            return res.status(409).json({error:'A user with this email is already exists.'});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
                address,
                role:'NORMAL_USER'
            }
        });

        res.status(201).json({message:'User register successfully!',userId:user.id});
    }catch(error){
        res.status(500).json({error:'Something went wrong .Please Try Again.'});

    }
};

const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(401).json({error:"Invalid email or password"});
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid email or password."});
        }

        const token=jwt.sign(
            {id:user.id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.status(200).json({
            message:'Login successfully',
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }catch(error){
        res.status(500).json({error:'Something went wrong.Please try again.'});
    }
};

const updatePassword=async (req,res)=>{
    const {currentPassword,newPassword}=req.body;
    try{
        const user=await prisma.user.findUnique({where:{id:req.user.id}});
        const isMatch=await bcrypt.compare(currentPassword,user.password);
        if(!isMatch){
            return res.status(401).json({error:'Current Password is incorrect.'});
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);
        await prisma.user.update({
            where:{id:req.user.id},
            data:{password:hashedPassword}
        });

        res.status(200).json({message:"Password updated successfully!"});
    }catch(error){
        res.status(500).json({error:'Something went wrong . Plase try again.'});
    }
};

export {register,login,updatePassword};