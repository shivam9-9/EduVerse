const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset passwordtoken
exports.resetPasswordToken = async (req,res)=>{
    try{
    //get email from req,body
    const email = req.body;
    //check user for this email
    const user= await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            message:"your email is not registered",
        })
    }
    //generate token
    const token= crypto.randomUUID();
    //update token by adding token and expiration time
    const updatedDetails =await User.findOneAndUpdate({
        email:email},
        {
            token:token,
            resetPasswordExpires:Date.now() +5*60*1000,
        },
        {new:true}
    )
    //create url 
    const url =`http://localhost:3000/update-password/${token}`
    // send mail containing the url
    await mailSender(email,"Password Reset link",`Password Reset Link: ${url}`)
    //return response
    return res.json({
        success:true,
        message:"email sent successfully please check email and  change password ",
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something Went wrong while reseting the password"
        })
    }

    
} 
exports.resetPassword = async(req,res)=>{
    try{
    //data fetch
    const {password,confirmPassword,token} = req.body;
    //validation
    if(password!==confirmPassword)
        return res.json({
    success:false,
    message:"Password not matching",
})
    //get userdetails
    const userDetails = await User.findOne({token:token});
    //if not entry
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid",

        })
    }
    //token time check
    if(userDetails.resetPasswordExpires<Date.now()){
  return res.json({
    success:false,
    message:"Token is expired , please regenerate yout token",
  })
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    //update password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )
    //return response
    return res.status(200).json({
        success:true,
        message:"password reset successfully",
    })
}
catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"something went wrong while reseting the password",
    })
}

}