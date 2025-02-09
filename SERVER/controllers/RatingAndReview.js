const ratingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const { default: mongoose } = require("mongoose");

//create rating

exports.createRating = async (req,res)=>{
    try{
        //get user id
        const userId=req.user.id;
        //fetched data 
        const {rating,review,courseId} = req.body;
        //check if user is enrolled 
        const courseDetails = await Course.findOne(
            {id:courseId,
            studentsEnrolled: {$elemMatch: {$eq: userId}},
            }
        )
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                Message:"Student is not enrolled in the course",
            })
        }
        //check user is already review the course
        const alreadyReviewd = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })
        if(alreadyReviewd){
            return res.status(403).json({
                success:true,
                message:"course is already  reviewed by the user",
            })
        }
        //create review and rating 
     const ratingReview = await RatingAndReview.create({
        rating,review,
        course:courseId,
        user:userId,
     })

        //update course with this rating and review
       const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
            {$push:{
                ratingAndReviews:ratingReview._id,
            }},
            {new:true}
        )
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            ratingReview,
        })

    }
    catch(error){
   console.log(error);
   return res.status(500).json({
    success:false,
    message:error.message,
   })
    }
}

//get average rating 
exports.getAverageRating = async(req,res)=>{
    try{

        //get course id
        const courseId = req.body.courseId;
        //calculate average rating 
        const result  = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        //return rating 
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating : result[0].averageRating,
            })
        }
    return res.status(200).json({
        success:true,
        message:"Average rating is 0 no rating given till now",
        averageRating:0,
    })
        
    }
    catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    })
    }
}
//get All rating and review
exports.getAllRating = async (req,res)=>{
    try{
    
        const allReviews = await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courseName",
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:"All Review fetched successfully",
            data:allReviews,
        })


    }
    catch(error){
        console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    })
    }
}