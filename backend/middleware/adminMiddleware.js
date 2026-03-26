import User from "../models/userSchema.js";

export const isAdmin = async (req,res,next)=>{

 try{

   const userId = req.headers.userid;

   const user = await User.findById(userId);

   if(user.role !== "admin"){
     return res.json({
       success:false,
       message:"Admin access only"
     });
   }

   next();

 }catch(error){

   res.json({success:false});

 }

};