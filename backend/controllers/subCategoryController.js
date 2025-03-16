const subCategoryService = require('../services/subCategoryService');

// Create a new subcategory
const createSubCategory = async (req, res) => {
  try {
    const subCategoryData = req.body;
    const subCategory = await subCategoryService.createSubCategory(subCategoryData);
    res.status(201).json({
      message: "Subcategory created successfully",
      subCategory,
    });  // Send the created subcategory as response with a message
  } catch (error) {
    res.status(400).json({
      message: "Error creating subcategory: " + error.message,
    });  // Error handling with clear message
  }
};

// Get all subcategories
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategories();
    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({
        message: "No subcategories found",
      });  // If no subcategories found, send a clear message
    }
    res.status(200).json({
      message: "Subcategories fetched successfully",
      subCategories,
    });  // Send all subcategories as response with a message
  } catch (error) {
    res.status(400).json({
      message: "Error fetching subcategories: " + error.message,
    });  // Error handling with clear message
  }
};

// Get a single subcategory by ID
const getSubCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await subCategoryService.getSubCategoryById(id);
    if (!subCategory) {
      return res.status(404).json({
        message: `Subcategory with ID ${id} not found`,
      });  // If subcategory not found by ID, return a message
    }
    res.status(200).json({
      message: "Subcategory fetched successfully",
      subCategory,
    });  // Send the subcategory by ID as response with a message
  } catch (error) {
    res.status(404).json({
      message: "Error fetching subcategory: " + error.message,
    });  // Error handling with clear message
  }
};

// Update a subcategory
const updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const subCategory = await subCategoryService.updateSubCategory(id, updatedData);
    if (!subCategory) {
      return res.status(404).json({
        message: `Subcategory with ID ${id} not found`,
      });  // If subcategory to update not found, send a message
    }
    res.status(200).json({
      message: "Subcategory updated successfully",
      subCategory,
    });  // Send the updated subcategory as response with a message
  } catch (error) {
    res.status(400).json({
      message: "Error updating subcategory: " + error.message,
    });  // Error handling with clear message
  }
};

// Delete a subcategory
const deleteSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await subCategoryService.deleteSubCategory(id);
    if (!response) {
      return res.status(404).json({
        message: `Subcategory with ID ${id} not found`,
      });  // If subcategory to delete not found, send a message
    }
    res.status(200).json({
      message: "Subcategory deleted successfully",
      response,
    });  // Send the success message as response with a message
  } catch (error) {
    res.status(404).json({
      message: "Error deleting subcategory: " + error.message,
    });  // Error handling with clear message
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
