const ProductModel = require("../models/ProductModel");
const FlagModel = require("../models/FlagModel");
const CategoryModel = require("../models/CategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");
const ChildCategoryModel = require("../models/ChildCategoryModel");
const mongoose = require("mongoose");

// Create a new product
const createProduct = async (data) => {
  try {
    const product = new ProductModel(data); // Save product with image names
    await product.save();
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get all products without pagination or filters
 */
const getProducts = async () => {
  try {
    // Fetch all products without any pagination or filters
    const products = await ProductModel.find()
      .select("-createdAt -updatedAt") // Optional fields to exclude from the response
      .populate([
        { path: "category", select: "-createdAt -updatedAt" },
        { path: "subCategory", select: "-createdAt -updatedAt" },
        { path: "childCategory", select: "-createdAt -updatedAt" },
        { path: "flags", select: "-createdAt -updatedAt" },
        { path: "variants", select: "-createdAt -updatedAt" },
        { path: "variants.size", select: "-createdAt -updatedAt" }, // If size is nested
      ]);

    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get a single product by ID
 */
const getProductById = async (productId) => {
  try {
    const product = await ProductModel.findOne({ productId }).populate([
      { path: "category", select: "-createdAt -updatedAt" },
      { path: "subCategory", select: "-createdAt -updatedAt" },
      { path: "childCategory", select: "-createdAt -updatedAt" },
      { path: "flags", select: "-createdAt -updatedAt" },
      { path: "variants", select: "-createdAt -updatedAt" },
      { path: "variants.size", select: "-createdAt -updatedAt" }, // If size is nested
    ]);
    if (!product) throw new Error("Product not found");
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a product by slug
const getProductBySlug = async (slug) => {
  try {
    // Ensure to use the slug directly, not the productId
    const product = await ProductModel.findOne({ slug }).populate([
      { path: "category", select: "-createdAt -updatedAt" },
      { path: "subCategory", select: "-createdAt -updatedAt" },
      { path: "childCategory", select: "-createdAt -updatedAt" },
      { path: "flags", select: "-createdAt -updatedAt" },
      { path: "variants", select: "-createdAt -updatedAt" },
      { path: "variants.size", select: "-createdAt -updatedAt" }, // If size is nested
    ]);

    if (!product) throw new Error("Product not found");

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Delete a product by ID
 */
const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await ProductModel.findOneAndDelete({ productId });
    if (!deletedProduct) throw new Error("Product not found");
    return deletedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all products with pagination, filters, and sorting
const getAllProducts = async ({
  page = 1,
  limit = 10,
  sort,
  category,
  subcategory,
  childCategory,
  stock,
  flags,
  isActive,
}) => {
  try {
    // Fetch category, subcategory, and childCategory independently
    const [categoryDoc, subCategoryDoc, childCategoryDoc, flagDocs] =
      await Promise.all([
        category
          ? CategoryModel.findOne({ name: category }).select("_id")
          : null,
        subcategory
          ? SubCategoryModel.findOne({
              slug: subcategory,
              isActive: true,
            }).select("_id")
          : null,
        childCategory
          ? ChildCategoryModel.findOne({
              slug: childCategory,
              isActive: true,
            }).select("_id")
          : null,
        flags
          ? FlagModel.find({
              name: { $in: flags.split(",") },
              isActive: true,
            }).select("_id")
          : [],
      ]);

    // If any provided category, subcategory, or childCategory is invalid, return an empty result
    if (
      (category && !categoryDoc) ||
      (subcategory && !subCategoryDoc) ||
      (childCategory && !childCategoryDoc) ||
      (flags && flagDocs.length === 0)
    ) {
      return {
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    let query = {};

    if (typeof isActive === "boolean") {
      query.isActive = isActive;
    }


    // Apply filters for valid active categories, subcategories, and child categories
    if (categoryDoc) query.category = categoryDoc._id;
    if (subCategoryDoc) query.subCategory = subCategoryDoc._id;
    if (childCategoryDoc) query.childCategory = childCategoryDoc._id;

    // Apply stock filter (in-stock or out-of-stock)
    if (stock === "in") query.finalStock = { $gt: 0 };
    if (stock === "out") query.finalStock = { $lte: 0 };

    // Apply flags filter if provided
    if (flagDocs.length)
      query.flags = { $in: flagDocs.map((flag) => flag._id) };

    // Default sorting to newest first
    let sortOption = { createdAt: -1 };

    // Check for valid sorting values
    const validSortValues = [
      "price_high",
      "price_low",
      "name_asc",
      "name_desc",
      "latest",
      "oldest",
    ];
    if (sort && !validSortValues.includes(sort)) {
      return {
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    // Sorting logic
    if (sort === "price_high") sortOption = { finalDiscount: -1 };
    if (sort === "price_low") sortOption = { finalDiscount: 1 };
    if (sort === "name_asc") sortOption = { name: 1 }; // A-Z
    if (sort === "name_desc") sortOption = { name: -1 }; // Z-A
    if (sort === "oldest") sortOption = { createdAt: 1 }; // Oldest first

    // Count total products based on the active filter
    const totalProducts = await ProductModel.countDocuments(query);

    // Fetch products with filters, sorting, and pagination
    const products = await ProductModel.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "name slug finalDiscount finalPrice finalStock thumbnailImage isActive images productId category variants flags productId",
      )
      .populate([
        { path: "category", select: "-createdAt -updatedAt" },
        { path: "flags", select: "-createdAt -updatedAt" },
        { path: "variants.size", select: "-createdAt -updatedAt" },
      ]);

    return {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a product by ID
const updateProduct = async (productId, updatedData, files) => {
  try {
    let product = await ProductModel.findOne({ productId });
    if (!product) {
      throw new Error("Product not found.");
    }

    // 🚫 Prevent updating productId
    delete updatedData.productId;

    // ✅ Handle file uploads from Multer
    if (files) {
      // If new thumbnail image is uploaded, update it
      if (files.thumbnailImage) {
        updatedData.thumbnailImage = files.thumbnailImage[0].filename; // Save only filename
      }

      // If new images are uploaded, append them to existing ones
      if (files.images) {
        const newImagePaths = files.images.map((file) => file.filename); // Get new image filenames
        updatedData.images = [...product.images, ...newImagePaths]; // Retain existing images and add new ones
      }
    }

    // ✅ Apply updates manually
    Object.assign(product, updatedData);
    await product.save();

    return product;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getSimilarProducts = async (category, excludeId) => {
  try {
    const categoryObjectId = new mongoose.Types.ObjectId(category);
    const excludeObjectId = new mongoose.Types.ObjectId(excludeId);

    // Fetch products without specific sorting
    const similarProducts = await ProductModel.find({
      category: categoryObjectId,
      _id: { $ne: excludeObjectId },
      isActive: true,
    })
      .limit(12) // Limiting to 12 products
      .select(
        "name slug finalDiscount finalPrice finalStock thumbnailImage isActive images productId category variants flags productId",
      )
      .populate([
        { path: "category", select: "-createdAt -updatedAt" },
        { path: "flags", select: "-createdAt -updatedAt" },
        { path: "variants.size", select: "-createdAt -updatedAt" },
      ]);

    // Randomize the order using a Fisher-Yates shuffle
    const shuffledProducts = shuffleArray(similarProducts);

    return shuffledProducts;
  } catch (error) {
    throw new Error("Failed to fetch similar products: " + error.message);
  }
};

// Fisher-Yates shuffle function to randomize the array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

// Get Products Details For Order
const getProductDetailsService = async ({ productId, variantId }) => {
  if (!productId) {
    throw { status: 400, message: "⚠️ productId is required!" };
  }

  const product = await ProductModel.findById(productId).lean();

  if (!product) {
    throw { status: 404, message: "❌ Product not found!" };
  }

  // Check if the product has variants
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  // 🔒 If product has variants but no variantId provided
  if (hasVariants && !variantId) {
    throw { status: 400, message: "⚠️ variantId is required for products with variants!" };
  }

  // 👉 If variantId is provided
  if (variantId) {
    const selectedVariant = product.variants.find(
      (variant) => variant._id.toString() === variantId
    );

    if (!selectedVariant) {
      throw { status: 404, message: "❌ Variant not found!" };
    }

    return {
      message: "✅ Product variant retrieved successfully!",
      variant: true,
      data: {
        productId: product._id,
        name: product.name,
        thumbnailImage: product.thumbnailImage,
        images: product.images,
        category: product.category,
        selectedVariant: {
          _id: selectedVariant._id,
          size: selectedVariant.size,
          price: selectedVariant.price,
          stock: selectedVariant.stock,
          discount: selectedVariant.discount ?? 0
        }
      }
    };
  }

  // ✅ If product has no variants and no variantId is required
  return {
    message: "✅ Product (no variant) retrieved successfully!",
    variant: false,
    data: {
      productId: product._id,
      name: product.name,
      shortDesc: product.shortDesc,
      longDesc: product.longDesc,
      thumbnailImage: product.thumbnailImage,
      images: product.images,
      category: product.category,
      finalPrice: product.finalPrice,
      finalDiscount: product.finalDiscount,
      finalStock: product.finalStock
    }
  };
};



module.exports = {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSimilarProducts,
  getProductDetailsService,
};
