import {PrismaClient} from '@prisma/client';
 
const prisma=new PrismaClient();

//get the store dashboard for the logged-in owner
const getOwnerStore=async(req,res)=>{
    try{
        const store=await prisma.store.findFirst({
            where:{ownerId:req.user.id},
            include:{
                ratings:{
                    include:{
                        user:{
                            select:{name:true,email:true}
                        }
                    }
                }
            }
        });
        if(!store){
            return res.status(404).json({error:"You do not have a store registered yet."});
        }

        const averageRating =store.ratings.length>0?store.ratings.reduce((sum,r)=>sum+r.score,0)/store.ratings.length:null;

        res.status(200).json({
            ...store,
            averageRating 
        });
    }catch(error){
        res.status(500).json({error:'Something went wrong.'});
    }
};

export {getOwnerStore};