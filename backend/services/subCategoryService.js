const SubCategory = require("../models/SubCategoryModel"); // Import the SubCategory model

// Create a new subcategory
const createSubCategory = async (subCategoryData) => {
  try {
    const subCategory = new SubCategory(subCategoryData);
    await subCategory.save();
    return subCategory;
  } catch (error) {
    throw new Error("Error creating subcategory: " + error.message);
  }
}

// Get all subcategories
const getAllSubCategories = async () => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category", "name")
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .exec();
    return subCategories;
  } catch (error) {
    throw new Error("Error fetching subcategories: " + error.message);
  }
};

// Get a single subcategory by ID
const getSubCategoryById = async (id) => {
  try {
    const subCategory = await SubCategory.findById(id)
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .populate("category", "name"); // Populate category's name field
    if (!subCategory) throw new Error("Subcategory not found");
    return subCategory;
  } catch (error) {
    throw new Error("Error fetching subcategory: " + error.message);
  }
};

// Update a subcategory
const updateSubCategory = async (id, updatedData) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(id, updatedData, {
      new: true,
    })
      .populate("category", "name")  // Populate category's name field
      .select("-createdAt -updatedAt");   // Exclude createdAt and updatedAt fields
    if (!subCategory) throw new Error("Subcategory not found");
    return subCategory;
  } catch (error) {
    throw new Error("Error updating subcategory: " + error.message);
  }
};

// Delete a subcategory
const deleteSubCategory = async (id) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) throw new Error("Subcategory not found");
    return { message: "Subcategory deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting subcategory: " + error.message);
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
