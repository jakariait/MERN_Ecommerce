import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import useProductStore from "../../store/useProductStore.js";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";
import { FaRegHeart, FaTags } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { Helmet } from "react-helmet";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { motion } from "framer-motion";
import useCartStore from "../../store/useCartStore.js";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import ProductGallery from "./ProductGallery.jsx";

const ProductDetails = () => {
  const { fetchProductBySlug, product, loading, error, resetProduct } =
    useProductStore();

  const { GeneralInfoList } = GeneralInfoStore();
  const { slug } = useParams();

  const [currentProductSlug, setCurrentProductSlug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const MAX_QUANTITY = 5; // Set the limit for Cart Quantity
  const { addToCart } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  // Handle Quantity Change
  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (slug !== currentProductSlug) {
      // Reset product state and show loading
      resetProduct(); // Clear previous product data
      setCurrentProductSlug(slug);
      fetchProductBySlug(slug);
    }
  }, [slug, currentProductSlug, fetchProductBySlug, resetProduct]);

  const formatPrice = (price) => {
    if (isNaN(price)) return price;
    return price.toLocaleString();
  };

  const calculateDiscountPercentage = (
    priceBeforeDiscount,
    priceAfterDiscount,
  ) => {
    if (
      !priceBeforeDiscount ||
      !priceAfterDiscount ||
      priceBeforeDiscount <= priceAfterDiscount
    )
      return 0;
    const discountAmount = priceBeforeDiscount - priceAfterDiscount;
    return Math.ceil((discountAmount / priceBeforeDiscount) * 100);
  };

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]); // Default to first variant when product is fetched
    }
  }, [product]);

  const handleSizeChange = (sizeName) => {
    const newVariant = product.variants.find(
      (variant) => variant.size.name === sizeName,
    );
    setSelectedVariant(newVariant);
  };
  const location = useLocation();
  const url = `${window.location.origin}${location.pathname}`;
  const title = product?.name;

  const discountPercentage =
    product?.finalPrice && product?.finalDiscount
      ? calculateDiscountPercentage(product.finalPrice, product.finalDiscount)
      : 0;

  // If product is loading, show a loading screen
  if (loading || product?.slug !== slug) {
    return (
      <div className="xl:container xl:mx-auto p-3">
        <div className={"grid md:grid-cols-2 gap-4"}>
          <div>
            <Skeleton height={650} width={"100%"} />
          </div>
          <div>
            <Skeleton height={50} width={"90%"} />
            <Skeleton height={50} width={"80%"} />
            <Skeleton height={50} width={"90%"} />
            <div className={"grid grid-cols-3 gap-1"}>
              <Skeleton height={50} width={"90%"} />
              <Skeleton height={50} width={"80%"} />
              <Skeleton height={50} width={"90%"} />
            </div>
            <Skeleton height={50} width={"90%"} />
            <Skeleton height={50} width={"50%"} />
            <Skeleton height={50} width={"40%"} />
            <div className={"grid grid-cols-2 gap-1"}>
              <Skeleton height={50} width={"100%"} />
              <Skeleton height={50} width={"100%"} />
            </div>
          </div>
        </div>
      </div>
    ); // Loading message while new product data is being fetched
  }

  return (
    <div className="xl:container xl:mx-auto p-3">
      {error && (
        <div className="text-red-500 flex items-center justify-center pt-40">
          Error: {error}
        </div>
      )}

      {product && (
        <div>
          {/*Seo Meta Data*/}
          <Helmet titleTemplate={`%s | ${GeneralInfoList?.CompanyName}`}>
            <html lang="en" />
            <meta name="robots" content="index, follow" />
            <title>{product?.name || product?.metaTitle}</title>
            <meta charSet="utf-8" />
            <meta name="description" content={product?.metaDescription} />
            <meta name="keywords" content={product.metaKeywords.join(", ")} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta
              property="og:title"
              content={product?.name || product?.metaTitle}
            />
            <meta
              property="og:description"
              content={product?.metaDescription}
            />
            <meta property="og:image" content={product?.thumbnailImage} />
            <meta property="og:url" content={window.location.href} />
          </Helmet>
          {/*BreadCrumbs*/}
          <div className={"md:p-3"}>
            <Breadcrumbs separator="/" aria-label="breadcrumb">
              {/* Home */}
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ textDecoration: "none" }} // Removes the underline
              >
                Home
              </Link>

              {/* Category */}
              {product?.category?.name && (
                <Link
                  component={RouterLink}
                  to={`/shop?category=${product.category.name}`}
                  color="inherit"
                  sx={{ textDecoration: "none" }}
                >
                  {product.category.name}
                </Link>
              )}

              {/* Subcategory */}
              {product?.subCategory?.name && (
                <Link
                  component={RouterLink}
                  to={`/shop?subcategory=${product.subCategory.slug}`}
                  color="inherit"
                  sx={{ textDecoration: "none" }}
                >
                  {product.subCategory.name}
                </Link>
              )}

              {/* Child Category */}
              {product?.childCategory?.name && (
                <Link
                  component={RouterLink}
                  to={`/shop?childCategory=${product.childCategory.slug}`}
                  color="inherit"
                  sx={{ textDecoration: "none" }}
                >
                  {product.childCategory.name}
                </Link>
              )}

              {/* Product Name */}
              {product?.name && (
                <Typography color="text.primary">{product.name}</Typography>
              )}
            </Breadcrumbs>
          </div>

          <div className="md:grid md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-9 gap-8">
            <div className="md:col-span-4 lg:col-span-6 xl:col-span-5 relative">
              <ProductGallery
                images={product.images}
                discount={discountPercentage}
              />
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 lg:col-span-3 xl:col-span-4 pt-4 md:pt-0">
              <h2 className="text-xl">{product.name}</h2>

              {/* Without Variant Price Display */}
              {!product.variants?.length && (
                <div className="flex gap-2">
                  <div className="line-through">
                    Tk. {formatPrice(Number(product.finalPrice))}
                  </div>
                  <div className="text-red-800">
                    Tk. {formatPrice(Number(product.finalDiscount))}
                  </div>
                  <div>
                    You Save: Tk{" "}
                    {formatPrice(
                      Number(product.finalPrice - product.finalDiscount),
                    )}
                  </div>
                </div>
              )}

              {/* Price Details */}
              {selectedVariant && (
                <div className="flex gap-2">
                  <div className="line-through">
                    Tk. {formatPrice(Number(selectedVariant.price))}
                  </div>
                  <div className="text-red-800">
                    Tk. {formatPrice(Number(selectedVariant.discount))}
                  </div>
                  <div>
                    You Save: Tk{" "}
                    {formatPrice(
                      Number(selectedVariant.price - selectedVariant.discount),
                    )}
                  </div>
                </div>
              )}

              {/* Reward Points */}
              <div>Purchase & Earn: {product.rewardPoints} points.</div>

              {/* Stock */}
              <div>
                {selectedVariant?.stock === 0 || product.finalStock === 0 ? (
                  <span className="text-red-600 font-semibold">Stock Out</span>
                ) : selectedVariant?.stock < 20 || product.finalStock < 20 ? (
                  <span className="primaryTextColor font-semibold">
                    Hurry up! Only{" "}
                    {selectedVariant?.stock || product.finalStock} left
                  </span>
                ) : (
                  <span>
                    Stock: {selectedVariant?.stock || product.finalStock}
                  </span>
                )}
              </div>

              {/* With Variant Price Display */}
              {product.variants?.length > 0 && (
                <div className={"flex gap-4 items-center"}>
                  <h2 className="text-lg">Size</h2>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.size.name}
                        onClick={() => handleSizeChange(variant.size.name)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          selectedVariant?.size.name === variant.size.name
                            ? "primaryBgColor text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {variant.size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/*Cart Quantity, Add to Cart and Wish List Button */}
              <div className={"flex gap-6 items-center justify-baseline mt-2"}>
                {/*Cart Quantity Button*/}
                <div className={"rounded flex items-center justify-between"}>
                  <button
                    className={
                      "primaryBgColor accentTextColor px-3 py-3 rounded-l"
                    }
                    onClick={() => handleQuantityChange("decrease")}
                  >
                    <FiMinus />
                  </button>
                  <span className={"px-4 py-2 bg-gray-200"}>{quantity}</span>
                  <button
                    className={
                      "primaryBgColor accentTextColor px-3 py-3 rounded-r"
                    }
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= MAX_QUANTITY} // Disable when limit is reached
                  >
                    <FaPlus />
                  </button>
                </div>
                {/*Add to Cart Button*/}
                {selectedVariant?.stock === 0 || product.finalStock === 0 ? (
                  <button className="text-red-600 font-semibold" disabled>
                    Stock Out
                  </button>
                ) : (
                  <motion.button
                    className="primaryBgColor accentTextColor px-3 py-2 rounded"
                    animate={{ scale: [1, 1.1, 1] }} // Scale animation
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    onClick={handleAddToCart}
                  >
                    ADD TO CART
                  </motion.button>
                )}

                {/*Wish List Button*/}
                <button
                  className={"primaryBgColor accentTextColor px-4 py-3 rounded"}
                >
                  <FaRegHeart />
                </button>
              </div>
              {/*Cash On Delivery Order Button*/}
              <motion.button
                className="primaryBgColor accentTextColor py-2 rounded"
                animate={{ scale: [1, 1.05, 1] }} // Scale animation
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ক্যাশ অন ডেলিভারিতে অর্ডার করুন
              </motion.button>
              {/*Social Share Buttons*/}

              <div className="flex  items-center gap-2">
                <h1>Social Share:</h1>
                <div className="flex gap-1">
                  <FacebookShareButton url={url} quote={title}>
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={url} title={title}>
                    <TwitterIcon size={28} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={url}>
                    <LinkedinIcon size={28} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton url={url} title={title} separator=" - ">
                    <WhatsappIcon size={28} round />
                  </WhatsappShareButton>
                </div>
              </div>
              {/*Product Code*/}
              {product.productCode && (
                <div>
                  <strong>Product Code:</strong> {product.productCode}
                </div>
              )}
              {/*Short Description*/}
              {product.shortDesc && <div>{product.shortDesc}</div>}
            </div>
          </div>

          <div className={"md:w-3/4 mx-auto shadow mt-4"}>
            {/*product Description*/}
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <span>Description</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div dangerouslySetInnerHTML={{ __html: product.longDesc }} />
              </AccordionDetails>
            </Accordion>
            {/*Product Size Chart*/}
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <span>Size Chart</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div dangerouslySetInnerHTML={{ __html: product.sizeChart }} />
              </AccordionDetails>
            </Accordion>
            {/*Shipping and Return*/}
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <span>Shipping and Return</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  dangerouslySetInnerHTML={{ __html: product.shippingReturn }}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
