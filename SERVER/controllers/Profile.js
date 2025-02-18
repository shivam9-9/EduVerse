const Profile = require("../models/Profile")
const User= require("../models/User");

exports.updateProfile = async (req,res)=>{
    try{
    // get data
    const {dateOfBirth="",about="",contactNumber,gender}=req.body;
    //get user id
    const id=req.user.id;
    //validation
    if(!contactNumber || !gender || !id){
        return res.status(400).json({
            success:false,
            message:"All field are required",
        })
    }
    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
    //return response
    return res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        profileDetails,
    })
    }
    catch(error){
return res.status(500).json({
    success:false,
    error:error.message,
})
    }
}

//delete account
exports.deleteAccount = async (req,res)=>{
    try{
// get id
const id= req.user.id;
//validation
const userDetails = await User.findById(id);
if(!userDetails){
    return res.status(404).json({
        success:false,
        message:"User not found",
    })
}
//delete profile 
await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
//delete user
await User.findByIdAndDelete({_id:id});
//return response
return res.status(200).json({
    success:true,
    message:"account deleted successfully",

})
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User can not be deleted",
            error:error.message,
        })
    }
}

exports.getAllUserDetails = async(req,res)=>{
    try{
        //get id
        const id= req.user.id;
        
        const userDetails = await user.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
        })
       

    }
    catch(error){
  return res.status(500).json({
    success:false,
    error:error.message,
  })
    }
}