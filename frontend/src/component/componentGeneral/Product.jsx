import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useProductStore from "../../store/useProductStore.js";
import useCategoryStore from "../../store/useCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import ImageComponent from "./ImageComponent.jsx";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";

const Product = () => {
  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    fetchProducts,
  } = useProductStore();
  const { categories } = useCategoryStore();
  const { flags } = useFlagStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 12,
    sort: searchParams.get("sort") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    childCategory: searchParams.get("childCategory") || "",
    stock: searchParams.get("stock") || "",
    flags: searchParams.get("flags") || "",
  });

  // Memoize filter handling functions
  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }, []);

  const handleItemsPerPageChange = useCallback((e) => {
    const newLimit = parseInt(e.target.value);
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  // Memoize the formatted price function
  const formatPrice = useCallback((price) => {
    if (isNaN(price)) return price;
    return price.toLocaleString();
  }, []);

  // Effect to update filters from searchParams
  useEffect(() => {
    const updatedFilters = {
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 12,
      sort: searchParams.get("sort") || "",
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      childCategory: searchParams.get("childCategory") || "",
      stock: searchParams.get("stock") || "",
      flags: searchParams.get("flags") || "",
    };
    setFilters(updatedFilters);
  }, [searchParams]);

  // Effect to sync filters with searchParams
  useEffect(() => {
    const params = { ...filters };
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key];
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Effect to fetch products when filters change
  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedFlags = useMemo(() => flags, [flags]);

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

  return (
    <div className="xl:container xl:mx-auto px-6 py-5 justify-center md:justify-start">
      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
            <Skeleton height={250} width="100%" />
          </div>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {memoizedCategories.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Flag</InputLabel>
                <Select
                  name="flags"
                  value={filters.flags}
                  onChange={handleFilterChange}
                  label="Flag"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {memoizedFlags.map((flag) => (
                    <MenuItem key={flag._id} value={flag.name}>
                      {flag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Stock</InputLabel>
                <Select
                  name="stock"
                  value={filters.stock}
                  onChange={handleFilterChange}
                  label="Stock"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="in">In Stock</MenuItem>
                  <MenuItem value="out">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort</InputLabel>
                <Select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  label="Sort"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="name_asc">Name: A to Z</MenuItem>
                  <MenuItem value="name_desc">Name: Z to A</MenuItem>
                  <MenuItem value="latest">Latest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Items per page</InputLabel>
                <Select
                  name="itemsPerPage"
                  value={filters.limit}
                  onChange={handleItemsPerPageChange}
                  label="Items per page"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {products.filter((product) => product.isActive).length === 0 ? (
            <Typography
              variant="body1"
              className="text-center text-gray-500 p-20 md:p-70 shadow rounded-lg"
            >
              No products found. Please check back later!
            </Typography>
          ) : (
            <div
              className={
                "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4"
              }
            >
              {products
                .filter((product) => product.isActive)
                .map((product) => (
                  <div className={"relative"}>
                    <Link to={`/product/${product.slug}`}>
                      <ImageComponent
                        imageName={product.thumbnailImage}
                        altName={product.name}
                        skeletonHeight={350}
                      />
                    </Link>
                    <Link to={`/product/${product.slug}`}>
                      <div className={"text-center mt-2 mb-1 hover:underline"}>
                        {product.name}
                      </div>
                    </Link>
                    <div className="flex gap-2  justify-center">
                      <div className={"line-through"}>
                        Tk. {formatPrice(Number(product.finalPrice))}
                      </div>
                      <div className={"text-red-800"}>
                        Tk. {formatPrice(Number(product.finalDiscount))}
                      </div>
                    </div>
                    <div className="absolute top-1 z-10">
                      <span className="bg-red-400 px-2 py-1 text-white">
                        -
                        {calculateDiscountPercentage(
                          product.finalPrice,
                          product.finalDiscount,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-center items-center mt-5">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outlined"
              color="primary"
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Typography
              variant="body1"
              component="span"
              style={{ margin: "0 10px" }}
            >
              Page {currentPage} of {totalPages} || Products:{" "}
              {products.filter((product) => product.isActive).length}
            </Typography>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outlined"
              color="primary"
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
