const ChildCategory = require("../models/ChildCategoryModel");

// Create a new child category
const createChildCategory = async (childCategoryData) => {
  try {
    const childCategory = new ChildCategory(childCategoryData);
    await childCategory.save();
    return childCategory || null;
  } catch (error) {
    throw new Error("Error creating child category: " + error.message);
  }
};

// Get all child categories
const getAllChildCategories = async () => {
  try {
    const childCategories = await ChildCategory.find()
      .populate("category", "name") // Exclude the _id field from category
      .populate("subCategory", "name") // Exclude the _id field from subCategory
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .exec();
    return childCategories || null;
  } catch (error) {
    throw new Error("Error fetching child categories: " + error.message);
  }
};

// Get a single child category by ID
const getChildCategoryById = async (id) => {
  try {
    const childCategory = await ChildCategory.findById(id)
      .populate("category", "name") // Exclude _id from category
      .populate("subCategory", "name") // Exclude _id from subCategory
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .exec();

    if (!childCategory) {
      throw new Error("Child category not found");
    }

    return childCategory || null;
  } catch (error) {
    throw new Error("Error fetching child category: " + error.message);
  }
};

// Update a Child Category
const updateChildCategory = async (id, updatedData) => {
  try {
    const childCategory = await ChildCategory.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      },
    )
      .populate("category", "name") // Exclude _id from category
      .populate("subCategory", "name") // Exclude _id from subCategory
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .exec();
    if (!childCategory) throw new Error("Child Category not found");
    return childCategory || null;
  } catch (error) {
    throw new Error("Error updating child category: " + error.message);
  }
};

// Delete a Child Category
const deleteChildCategory = async (id) => {
  try {
    const childCategory = await ChildCategory.findByIdAndDelete(id);
    if (!childCategory) throw new Error("Child Category not found");
    return { message: "Child Category deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting child category: " + error.message);
  }
};

module.exports = {
  createChildCategory,
  getAllChildCategories,
  getChildCategoryById,
  updateChildCategory,
  deleteChildCategory,
};
