import {PrismaClient} from '@prisma/client';

const prisma=new PrismaClient();


//Get all Stores with search
const getStores=async(req,res)=>{
    const {name,address}=req.query;

    try{
        const stores =await prisma.store.findMany({
            where:{
                AND:[
                    name?{name:{contains:name,mode:'insensitive'}}:{},
                    address?{address:{contains:address,mode:'insensitive'}}:{}
                ]
            },
            include:{
                ratings:true
            }
        });
        const storesWithData=stores.map(store=>{
            const avgRating=store.ratings.length>0?store.ratings.reduce((sum,r)=>sum+r.score,0)/store.ratings.length:null;

            const userRating=store.ratings.find(r=>r.userId===req.user.id);

            return {
                id:store.id,
                name:store.name,
                email:store.email,
                address:store.address,
                averageRating:avgRating,
                myRating:userRating?userRating.score:null
            };
        });
        res.status(200).json(storesWithData);

    }catch(error){
        res.status(500).json({error:'Something went wrong.'});
    }
};

//Submit rating to store
const submitRating=async (req,res)=>{
    const { storeId,score }=req.body;

    if(!score||score<1||score>5){
        return res.status(400).json({error:"Score must be between 1 and 5"});
    }

    try{

        const store=await prisma.store.findUnique({where:{id:storeId}});

        if(!store){
            return res.status(404).json({error:"store not found."});
        }

        const existingRating=await prisma.rating.findUnique({
            where:{userId_storeId:{userId:req.user.id,storeId}}
        });

        if(existingRating){
            return res.status(409).json({error:"YOu have already rated this store.Use update instad"});

        }

        const rating=await prisma.rating.create({
            data:{score,userId:req.user.id,storeId}
        });

        res.status(201).json({message:"Rating submitted successfully!",ratingId:rating.id});
    }catch(error){
        res.status(500).json({error:"Something went wrong."});
    }

};

//update existing rating
const updateRating=async(req,res)=>{
    const{ratingId}=req.params;
    const{score}=req.body;

    if(!score||score<1||score>5){
        return res.status(400).json({error:"score must be between 1 and 5."});
    }

    try{
        const existingRating=await prisma.rating.findUnique({where:{id:ratingId}});

        if(!existingRating){

            return res.status(404).json({error:"Rating not Found."});

        }

        if(existingRating.userId!==req.user.id){
            return res.status(403).json({error:"You can only update your own ratings."});
        }

        const updated=await prisma.rating.update({
            where:{id:ratingId},
            data:{score}
        });

        res.status(200).json({message:"Rating updated successfully!",rating:updated});
    }catch(error){
        res.status(500).json({error:'something went wrong.'});
    }
};

export {getStores,submitRating,updateRating};

