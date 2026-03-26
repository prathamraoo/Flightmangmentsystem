import jwt from "jsonwebtoken";

const SECRETKEY = "MysecretKey";

export const adminAuth = (req,res,next)=>{

  try{

    let token = req.headers.authorization;

    if(!token){
      return res.status(401).json({
        success:false,
        message:"No token provided"
      });
    }

    // Remove "Bearer " prefix if present
    if(token.startsWith("Bearer ")){
      token = token.substring(7);
    }

    const decoded = jwt.verify(token,SECRETKEY);

    if(decoded.role !== "admin"){
      return res.status(403).json({
        success:false,
        message:"Admin access only"
      });
    }

    req.user = decoded;

    next();

  }catch(error){

    res.status(401).json({
      success:false,
      message:"Invalid token"
    });

  }

};