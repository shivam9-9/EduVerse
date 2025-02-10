const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// create course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details: ", instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: true,
        message: "Instructor details not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(400).json({
        success: true,
        message: "Tag details not found",
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse = await Course.create({
      instructor: instructorDetails._id,
      courseName: courseName,
      courseDescription: courseDescription,
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add new course to user schema
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },

      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update tag schema
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      messgae: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      messgae: "Failed to create course",
      error: err.message,
    });
  }
};

// get all courses

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        instructor: true,
        thumbnail: true,
        price: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: " Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      messgae: "Failed to fetch courses",
      error: err.message,
    });
  }
};

//get couse details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndRevies")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with course id : ${courseId}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
