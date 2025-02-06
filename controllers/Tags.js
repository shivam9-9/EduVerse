const Tag = require("../models/Tags");

exports.createTag = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;

    // data validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Tag Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// getAllTags

exports.showAlltags = async (req, res) => {
  try {
    const allTags = Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "All Tags Fetched Successfully",
      allTags,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
