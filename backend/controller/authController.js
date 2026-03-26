import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRETKEY = "MysecretKey";

export const registerUser = async (req,res)=>{

 try{

  const { username,useremail,userphone,userpassword } = req.body;

  const existingUser = await User.findOne({email:useremail});

  if(existingUser){
    return res.json({
      success:false,
      message:"User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(userpassword,10);

  const newUser = await User.create({
    name:username,
    email:useremail,
    phone:userphone,
    password:hashedPassword,
    role:"user"
  });

  res.json({
    success:true,
    message:"User registered successfully"
  });

 }catch(error){
  res.json({
   success:false,
   message:"Register error"
  });
 }

};


export const loginUser = async (req,res)=>{

 try{

  const { useremail,userpassword } = req.body;

  const userData = await User.findOne({email:useremail});

  if(!userData){
   return res.json({
    success:false,
    message:"User not found"
   });
  }

  const match = await bcrypt.compare(
   userpassword,
   userData.password
  );

  if(!match){
   return res.json({
    success:false,
    message:"Invalid password"
   });
  }

  const token = jwt.sign(
   {id:userData._id,role:userData.role},
   SECRETKEY,
   {expiresIn:"1d"}
  );

  res.json({
   success:true,
   token,
   role:userData.role
  });

 }catch(error){

  res.json({
   success:false,
   message:"Login error"
  });

 }

};