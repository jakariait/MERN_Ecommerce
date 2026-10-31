const CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');

const createCategory = async (categoryData) => {
  const category = new CategoryModel(categoryData);
  return await category.save();
};

const getCategories = async () => {
  const [categories, counts] = await Promise.all([
    CategoryModel.find(),
    ProductModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return categories.map((category) => ({
    ...category.toObject(),
    productsCount: countMap.get(String(category._id)) || 0,
  }));
};

const getCategoryById = async (id) => {
  return await CategoryModel.findById(id);
};

const updateCategory = async (id, categoryData) => {
  return await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });
};

const deleteCategory = async (id) => {
  return await CategoryModel.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
