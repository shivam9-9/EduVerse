const jwt = require("jsonwebtoken");
require("dotenv").config();
const User= require("../models/User");

//auth
exports.auth = async(req,res,next)=>{
try{
   //extract token
   const token= req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
   //if token missing return response
   if(!token){
    return res.status(401).json({
        success:false,
        message:"Token is missing",
    })
   }
   //veryify the token
   try{
const decode =  jwt.verify(token,process.env.JWT_SECRET);
console.log(decode);
req.user = decode;
   }
   catch(error){
return res.status(401).json({
    success:false,
    message:"Token is invalid",
})
   }
   next();
}
catch(error){
return res.status(401).json({
    success:false,
    message:"Something went wrong while validating the token",
})
}
}
//is student
exports.isStudent = async (req,res,next)=>{
    try{
       if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success:false,
            message:"this is the protected route for student only",
        })
       }
       next();
    }
    catch(error){
    return res.status(500).json({
        success:false,
        message:"User role cannot be verified",
    })
    }
}
//isInstructor
exports.isInstructor = async (req,res,next)=>{
    try{
       if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
            success:false,
            message:"this is the protected route for Instructor only",
        })
       }
       next();
    }
    catch(error){
    return res.status(500).json({
        success:false,
        message:"User role cannot be verified",
    })
    }
}
//admin
exports.isAdmin = async (req,res,next)=>{
    try{
       if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success:false,
            message:"this is the protected route for Admin only",
        })
       }
       next();
    }
    catch(error){
    return res.status(500).json({
        success:false,
        message:"User role cannot be verified",
    })
    }
}