const Category = require("../models/Category");

exports.createCategory = async (req, res) => {

};
exports.showAllCategories = async (req, res) => {

};

//categoryPage detail
exports.categoryPageDetails = async (req, res) => {
  try {
    //get category id
    const { categoryId } = req.body;
    //get courses for specified courses
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    //validtion
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        Message: "data not found",
      });
    }
    //get courses for diffent categories
    const diffentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    //get top selling courses
    //return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        diffentCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      Message: error.message,
    });
  }
};
