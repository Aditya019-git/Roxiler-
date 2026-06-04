const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex=/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;

export const validateRegistration=(req,res,next)=>{
    const {name,email,password,address}=req.body;

    if(!name||name.length<20||name.length>60){
        return res.status(400).json({error:"Name must be between 20 and 60 characters long"});
    }

    if(!email||!emailRegex.test(email)){
        return res.status(400).json({error:"Please provide valid email address."});
    }

    if(!password||!passwordRegex.test(password)){
        return res.status(400).json({error:"Password must be 8-16 charactes long and include at least one uppercase letter and one special character."});
    }

    if(!address||address.length>400){
        return res.status(400).json({error:"Address cannot exceed 400 characters."});
    }

    next();
}

