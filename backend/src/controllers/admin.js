import  {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma=new PrismaClient();

//dashboard Stats
const getDashboardStats=async(req,res)=>{
    try{
        const totalUsers=await prisma.user.count();
        const totalStores=await prisma.store.count();
        const totalRatings=await prisma.rating.count();

        res.status(200).json({totalUsers,totalStores,totalRatings});
    }catch(error){
        res.status(500).json({error:"Something went wrong"});
    }
};


//get All users with filters and sorting 
const getAllUsers=async (req,res)=>{
    const {name,email,role,sortBy='name',order='asc'}=req.query;

    try{
        const users=await prisma.user.findMany({
            where:{
                AND:[
                    name?{name:{contains:name,mode:'insensitive'}}:{},
                    email?{email:{contains:email,mode:'insensitive'}}:{},
                    role?{role:role}:{}
                ]
            },
            orderBy:{[sortBy]:order},
            select:{
                id:true,
                name:true,
                email:true,
                address:true,
                role:true,
                createdAt:true
            }
        });
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({error:"Something went Wrong."});
    }
};


//get single user with their rating 
const getUserById=async (req,res)=>{
    const {id}=req.params;

    try{
        const user=await prisma.user.findUnique({
            where:{id},
            select:{
                id:true,
                name:true,
                email:true,
                address:true,
                role:true,
                ownedStores:{
                    include:{
                        ratings:true
                    }
                }
            }
        });
        if(!user){
            return res.status(404).json({error:"User not Found."});
        }

        let averageRating=null;
        if(user.ownedStores.length>0){
            const allRatings=user.ownedStores.flatMap(store=>store.ratings);
            if(allRatings.length>0){
                averageRating=allRatings.reduce((sum,r)=>sum+r.score,0)/allRatings.length;
            }
        }
        res.status(200).json({...user,averageRating});
    }catch(error){
        res.status(500).json({error:'Something went wrong.'});
    }
};


//add new user 
const addUser=async(req,res)=>{
    const{name,email,password,address,role}=req.body;

    try{
        const existingUser=await prisma.user.findUnique({where:{email}});

        if(existingUser){
            return res.status(409).json({error:"A user with this email already exists."});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await prisma.user.create({
            data:{name,email,password:hashedPassword,address,role}
        });

        res.status(201).json({message:"User created successfully!",userId:user.id});
    }catch(error){
        res.status(500).json({error:"Something went wrong"});
    }
};

//get all stores with filter
const getAllStores=async (req,res)=>{
    const {name,email,address,sortBy='name',order='asc'}=req.query;
    try{
        const stores=await prisma.store.findMany({
            where:{
                AND:[
                    name?{name:{contains:name,mode:'insensitive'}}:{},
                    email?{email:{contains:email,mode:'insensitive'}}:{},
                    address?{address:{contains:address,mode:'insensitive'}}:{}
                ]
            },
            orderBy:{[sortBy]:order},
            include:{
                ratings:true,
                owner:{
                    select:{name:true,email:true}
                }
            }

        });

        const storesWithRating=stores.map(store=>({
            id:store.id,
            name:store.name,
            email:store.email,
            address:store.address,
            owner:store.owner,
            avarageRating:store.ratings.length>0?store.ratings.reduce((sum,r)=>sum+r.score,0)/store.ratings.length:null
        }));

        res.status(200).json(storesWithRating);

    }catch(error){
        res.status(500).json({error:'Somethingwent wrong.'});
    }

};

//Add a new Store
const addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });

    if (!owner || owner.role !== 'STORE_OWNER') {

      return res.status(400).json({ error: 'Owner must be a valid user with STORE_OWNER role.' });
    }

    const store = await prisma.store.create({

      data: { name, email, address, ownerId }

    });
    
    res.status(201).json({ message: 'Store created successfully!', storeId: store.id });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};


export { getDashboardStats, getAllUsers, getUserById, addUser, getAllStores, addStore };




