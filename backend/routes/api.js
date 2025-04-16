const express = require("express");
const multer = require("multer");
const path = require("path");
const generalInfoController = require("../controllers/GeneralInfoController");
const newsletterController = require("../controllers/NewsLetterController");
const CarouselController = require("../controllers/CarouselController");
const featureImageController = require("../controllers/FeatureImageController");
const colorController = require("../controllers/ColorController");
const socialMediaLinkController = require("../controllers/SocialMediaLinkController");
const contactController = require("../controllers/ContactController");
const AdminController = require("../controllers/AdminController");
const categoryController = require("../controllers/categoryController");
const subCategoryController = require("../controllers/subCategoryController");
const childCategoryController = require("../controllers/childCategoryController");
const productSizeController = require("../controllers/productSizeController");
const flagController = require("../controllers/flagController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const shippingController = require("../controllers/ShippingController");

// Admin
const { adminProtect } = require("../middlewares/authAdminMiddleware");
const { authenticateToken } = require("../middlewares/authenticateToken");

// User
const { userProtect } = require("../middlewares/authUserMiddleware");
const {
  authenticateUserToken,
} = require("../middlewares/authinticateUserToken");

require("dotenv").config();

const router = express.Router();

// Set Up Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Ensure files are saved in the 'uploads' folder
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)), // Naming files uniquely
});

const upload = multer({ storage }).fields([
  {
    name: "PrimaryLogo",
    maxCount: 1,
  },
  {
    name: "SecondaryLogo",
    maxCount: 1,
  },
  {
    name: "Favicon",
    maxCount: 1,
  },
  {
    name: "imgSrc",
    maxCount: 1,
  },
  {
    name: "categoryIcon",
    maxCount: 1,
  },
  {
    name: "categoryBanner",
    maxCount: 1,
  },
  {
    name: "thumbnailImage",
    maxCount: 1,
  },
  {
    name: "images",
  },
  {
    name: "userImage",
    maxCount: 1,
  },
]);

// Serve images from the 'uploads' folder as static files
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

//   Routes for General Information
router.get("/getGeneralInfo", generalInfoController.getGeneralInfo);
router.post(
  "/updateGeneralInfo",
  upload,
  adminProtect,
  generalInfoController.generalInfoUpdate,
);
router.delete(
  "/deleteGeneralInfo",
  adminProtect,
  generalInfoController.deleteGeneralInfo,
);

//   Routes for Newsletter Subscription
router.post("/subscribe", newsletterController.subscribe); // POST /api/newsletter/subscribe
router.get("/subscribers", adminProtect, newsletterController.getSubscription); // GET /api/newsletter/subscribers
router.delete(
  "/delete-subscriber",
  adminProtect,
  newsletterController.deleteSubscriber,
);

//  Routes for Carousel
router.post(
  "/createcarousel",
  upload,
  adminProtect,
  CarouselController.createCarousel,
);
router.get("/getallcarousel", CarouselController.getAllCarousel);
router.delete(
  "/deletebyidcarousel/:id",
  adminProtect,
  CarouselController.deleteByIdCarousel,
);

// Routes for Feature Images
router.post(
  "/feature-images/create",
  upload,
  adminProtect,
  featureImageController.createFeatureImage,
);
router.get("/feature-images", featureImageController.getAllFeatureImages);
router.get(
  "/feature-images/:id",
  adminProtect,
  featureImageController.getFeatureImageById,
);
router.put(
  "/feature-images/:id",
  upload,
  adminProtect,
  featureImageController.updateFeatureImage,
);
router.delete(
  "/feature-images/:id",
  adminProtect,
  featureImageController.deleteFeatureImage,
);

// Routes for Colors
router.get("/colors", colorController.getColors);
router.put("/colors", adminProtect, colorController.updateColor);

// Routes for Social Media Link
router.get("/socialmedia", socialMediaLinkController.getSocialMedia);
router.put(
  "/socialmedia",
  adminProtect,
  socialMediaLinkController.updateSocialMedia,
);

// Routes for Contact Us Form
router.post("/contacts", contactController.createContact);
router.get("/contacts", adminProtect, contactController.getAllContacts);
router.get("/contacts/:id", adminProtect, contactController.getContactById);
router.put("/contacts/:id", adminProtect, contactController.updateContact);
router.delete("/contacts/:id", adminProtect, contactController.deleteContact);

// Admin Login route
router.post("/admin/login", AdminController.loginAdmin);
router.get("/admin/me", authenticateToken, AdminController.getLoggedInAdmin);

// User Login Route

// 🚀 Public Routes
router.post("/login", userController.loginUser); // User login (email/phone and password)
router.post("/register", userController.createUser); // Create a new user

// 🚀 Protected Routes (Requires Authentication)
router.get("/profile", userProtect, userController.getLoggedInUser); // Get logged-in user's profile
router.put("/updateUser/:id", upload, userController.updateUser);
router.put(
  "/request-deletion",
  userProtect,
  userController.requestAccountDeletion,
);

// Admin Protected Routes
router.get("/getAllUsers", adminProtect, userController.getAllUsers);
router.get("/getUserById/:id", adminProtect, userController.getUserById);
router.delete("/deleteUser/:id", adminProtect, userController.deleteUser);

// CRUD routes for Admin User
router.get("/admin/", adminProtect, AdminController.getAllAdmins);
router.get("/admin/:id", adminProtect, AdminController.getAdminById);
router.post("/admin/", adminProtect, AdminController.createAdmin);
router.put("/admin/:id", adminProtect, AdminController.updateAdmin);
router.delete("/admin/:id", adminProtect, AdminController.deleteAdmin);

// CRUD routes for Products Category
router.get("/category", categoryController.getCategories);
router.get("/category/:id", categoryController.getCategoryById);
router.post("/category/", adminProtect, categoryController.createCategory);
router.put("/category/:id", adminProtect, categoryController.updateCategory);
router.delete("/category/:id", adminProtect, categoryController.deleteCategory);

// Define routes for subcategories
router.get("/sub-category", subCategoryController.getAllSubCategories);
router.get("/sub-category/:id", subCategoryController.getSubCategoryById);
router.post(
  "/sub-category",
  adminProtect,
  subCategoryController.createSubCategory,
);
router.put(
  "/sub-category/:id",
  adminProtect,
  subCategoryController.updateSubCategory,
);
router.delete(
  "/sub-category/:id",
  adminProtect,
  subCategoryController.deleteSubCategory,
);

// Define routes for Child Categories
router.get("/child-category", childCategoryController.getAllChildCategories);
router.get("/child-category/:id", childCategoryController.getChildCategoryById);
router.post(
  "/child-category",
  adminProtect,
  childCategoryController.createChildCategory,
);
router.put(
  "/child-category/:id",
  adminProtect,
  childCategoryController.updateChildCategory,
);
router.delete(
  "/child-category/:id",
  adminProtect,
  childCategoryController.deleteChildCategory,
);

// Product Size Routes
router.get("/product-sizes", productSizeController.getAllProductSizes);
router.get("/product-sizes/:id", productSizeController.getProductSizeById);
router.post(
  "/product-sizes",
  adminProtect,
  productSizeController.createProductSize,
);
router.put(
  "/product-sizes/:id",
  adminProtect,
  productSizeController.updateProductSize,
);
router.delete(
  "/product-sizes/:id",
  adminProtect,
  productSizeController.deleteProductSize,
);
// Routes for Flags
router.get("/flags", flagController.getAllFlags);
router.get("/flags/:id", flagController.getFlagById);
router.post("/flags", adminProtect, flagController.createFlag);
router.put("/flags/:id", adminProtect, flagController.updateFlag);
router.delete("/flags/:id", adminProtect, flagController.deleteFlag);

// Routes for Products
router.get("/products", productController.getProducts); // All Products Without Sorting
router.get("/getAllProducts", productController.getAllProducts); // All Products With Sorting
router.get("/getAllProductsAdmin", productController.getAllProductsAdmin);
router.get("/products/:id", productController.getProductById);
router.get("/products/slug/:slug", productController.getProductBySlug);
router.post("/products", adminProtect, upload, productController.createProduct);
router.put(
  "/products/:id",
  adminProtect,
  upload,
  productController.updateProduct,
);
router.delete("/products/:id", adminProtect, productController.deleteProduct);
router.get(
  "/similar/:category/:productId",
  productController.getSimilarProductsController,
);
router.get("/getProductDetails", productController.getProductDetails);

// Cart Routes
router.get("/getCart", userProtect, cartController.getCart);
router.post("/addToCart", userProtect, cartController.addToCart);
router.patch("/updateCartItem", userProtect, cartController.updateCartItem);
router.delete("/removeCartItem", userProtect, cartController.removeCartItem);
router.delete("/clearCart", userProtect, cartController.clearCart);

// Shipping Option Routes
router.post("/createShipping", shippingController.createShipping);
router.get("/getAllShipping", shippingController.getAllShipping);
router.get("/getShippingById/:id", shippingController.getShippingById);
router.patch("/updateShipping/:id", shippingController.updateShipping);
router.delete("/deleteShipping/:id", shippingController.deleteShipping);

module.exports = router;
