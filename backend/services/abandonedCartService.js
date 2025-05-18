const AbandonedCart = require("../models/AbandonedCartModel");
const Product = require("../models/ProductModel");
const ProductSizeModel = require("../models/ProductSizeModel"); // Import the ProductSizeModel

const createAbandonedCart = async (cartData) => {
  try {
    const abandonedCart = new AbandonedCart(cartData);
    const savedCart = await abandonedCart.save();
    return savedCart;
  } catch (error) {
    throw new Error("Error creating abandoned cart: " + error.message);
  }
};


const deleteAbandonedCartById = async (cartId) => {
  try {
    const deletedCart = await AbandonedCart.findByIdAndDelete(cartId);
    return deletedCart; // null if not found
  } catch (error) {
    throw new Error("Error deleting abandoned cart: " + error.message);
  }
};


const getAllAbandonedCarts = async () => {
  try {
    const carts = await AbandonedCart.find().sort({ createdAt: -1 }).lean();

    const allProductIds = [
      ...new Set(
        carts.flatMap((cart) => cart.cartItems.map((item) => item.productId)),
      ),
    ];

    const products = await Product.find({ _id: { $in: allProductIds } })
      .populate("category", "name")
      .lean();

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const sizeIds = new Set();

    carts.forEach((cart) => {
      cart.cartItems = cart.cartItems.map((item) => {
        const product = productMap.get(item.productId?.toString());

        if (product) {
          const matchedVariant = product.variants.find(
            (v) => v._id.toString() === item.variantId?.toString(),
          );

          if (matchedVariant) {
            if (matchedVariant.size) {
              sizeIds.add(matchedVariant.size.toString());
            }

            item.variant = {
              ...matchedVariant,
              size: matchedVariant.size?.toString(), // normalize
            };
          }

          item.product = {
            _id: product._id,
            name: product.name,
            productCode: product.productCode,
            category: product.category?.name || "N/A",
            subCategory: product.subCategory,
            childCategory: product.childCategory,
            thumbnailImage: product.thumbnailImage,
            images: product.images,
            finalPrice: product.finalPrice,
            finalDiscount: product.finalDiscount,
            finalStock: product.finalStock,
            slug: product.slug,
          };
        }

        return item;
      });
    });

    const sizes = await ProductSizeModel.find({
      _id: { $in: Array.from(sizeIds) },
    })
      .select("name")
      .lean();

    const sizeMap = new Map(sizes.map((s) => [s._id.toString(), s.name]));

    carts.forEach((cart) => {
      cart.cartItems.forEach((item) => {
        if (item.variant?.size) {
          item.variant.sizeName = sizeMap.get(item.variant.size) || "N/A";
        }
      });
    });

    return carts;
  } catch (error) {
    throw new Error("Error fetching abandoned carts: " + error.message);
  }
};

module.exports = {
  createAbandonedCart,
  getAllAbandonedCarts,
  deleteAbandonedCartById,
};
