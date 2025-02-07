const SubSection = require("../models/Subsection");
const Section = require("../models/Section");
const {uploadImageToCloudinary}= require("../utils/imageUploader");


exports.createSubSection = async (req,res)=>{
    try{
//fetched data
const {sectionId,title,timeDuration,description}= req.body;
//extract file
const video= req.files.videoFile;
//validation
if(!sectionId || !title || !timeDuration || !description ||!video){
    return res.status(400).json({
        success:false,
        message:"All fields are required",
    })
}
//upload to clodinary
const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
//create a subsection
const SubsectionDetails = await SubSection.create({
    title:title,
    timeDuration:timeDuration,
    description:description,
    videoUrl:uploadDetails.secure_url,
})
//update section with the subsection'
const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
    {$push:{
        SubSection:SubsectionDetails._id,
    }},
    {new:true},
)
// return response
return res.status(200).json({
    success:true,
    message:"Subsection created successfully",
    updatedSection,
})

    }
    catch(error){
  return res.status(500).json({
    success:false,
    message:"internal server error",
    error:error.message,
  })
    }

}