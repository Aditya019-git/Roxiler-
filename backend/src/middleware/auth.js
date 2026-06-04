import jwt from 'jsonwebtoken';
const protect =(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader&&authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error:'Access denied.No token provided.'});

    }
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        next();
    }catch(err){
        return res.status(403).json({error:'Invalid or expired token.'});
    }
};

const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error:'You do not have permission to perform this action.'});
        }
        next();

    };

};

export {protect,authorize};