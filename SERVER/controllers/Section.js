const Section = require("../models/Section");
const Course =require("../models/Course");

exports.createSection = async (req,res)=>{
    try{
  //data fetch
  const {sectionName,courseId}=req.body;

  //data validation
  if(!sectionName || !courseId){
    return res.status(400).json({
        success:false,
        message:"Missing Properties",
    })
  }
  //create section
  const newSection = await Section.create({sectionName});
  //update courses with section object id
  const updatedCourseDetails = await Course.findByIdAndUpdate(
    courseId,
    {$push:{
        courseContent:newSection._id,
    }},
    {new:true},
  )
  //return response
  return res.status(200).json({
    success:true,
    message:"Section created successfully",
    updatedCourseDetails,
  })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section try again",
            error:error.message,
        })
    }
}
exports.updateSection =async (req,res)=>{
    try{

        //data input
        const {sectionName,sectionId}= req.body;
        //data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
          }
        //update data 
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section try again",
            error:error.message,
        })
    }
}

exports.deleteSection = async (req,res)=>{
    try{
       //get id
       const {sectionId}=  req.params;

       //use find by id and delete
       await Section.findByIdAndDelete(sectionId);

       return res.status(200).json({
        success:true,
        message:"section deleted successfully",
       })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section try again",
            error:error.message,
        })
    }
}