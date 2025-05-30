import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useProductStore from "../../store/useProductStore.js";
import useCategoryStore from "../../store/useCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
  Drawer,
  IconButton,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import {
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  ArrowDownWideNarrow,
  SlidersHorizontal,
  Radio,
  Circle,
  ArrowUp10,
  ArrowDown01,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
} from "lucide-react";
import ProductList from "./ProductList.jsx";

const Product = () => {
  // Global store values
  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    fetchProducts,
    totalProducts,
  } = useProductStore();

  const { categories } = useCategoryStore();
  const { flags } = useFlagStore();

  // Local state for drawer visibility (mobile filters and preview)
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  // URL search parameters for syncing state
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state derived from searchParams
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 20,
    sort: searchParams.get("sort") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    childCategory: searchParams.get("childCategory") || "",
    stock: searchParams.get("stock") || "",
    flags: searchParams.get("flags") || "",
  });

  // Handler to change pages
  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  // Handler for all dropdown-based filters
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    setLeftDrawerOpen(false);
    setRightDrawerOpen(false);
  }, []);

  // Handler to change items per page
  const handleItemsPerPageChange = useCallback((e) => {
    const newLimit = parseInt(e.target.value);
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  // Sync filters with search params on mount & search param change
  useEffect(() => {
    const updatedFilters = {
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 20,
      sort: searchParams.get("sort") || "",
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      childCategory: searchParams.get("childCategory") || "",
      stock: searchParams.get("stock") || "",
      flags: searchParams.get("flags") || "",
    };
    setFilters(updatedFilters);
  }, [searchParams]);

  // Update URL whenever filters change
  useEffect(() => {
    const params = { ...filters };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // Memoized values to avoid unnecessary re-renders
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedFlags = useMemo(
    () => flags.filter((flag) => flag.isActive),
    [flags],
  );

  // Show error if exists
  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <div className="xl:container xl:mx-auto px-6 py-5 justify-center md:justify-start">
      {/* Loading skeletons */}
      {loading ? (
        [...Array(6)].map((_, idx) => (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {[...Array(4)].map((_, subIdx) => (
              <Skeleton key={subIdx} height={250} width="100%" />
            ))}
          </div>
        ))
      ) : (
        <>
          {/* Mobile Filter/Sort Buttons */}
          <div className="md:hidden mb-4 flex justify-between">
            <IconButton onClick={() => setLeftDrawerOpen(true)}>
              <SlidersHorizontal size={25} className="primaryTextColor" />
            </IconButton>
            <IconButton onClick={() => setRightDrawerOpen(true)}>
              <ArrowDownWideNarrow size={30} className="primaryTextColor" />
            </IconButton>
          </div>

          {/* Mobile Left Drawer (Filters) */}
          <Drawer
            anchor="left"
            open={leftDrawerOpen}
            onClose={() => setLeftDrawerOpen(false)}
          >
            <div className="w-[300px] p-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={() => setLeftDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="flex flex-col gap-4  justify-between items-center mb-4">
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
                    {memoizedCategories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Flag Filter */}
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

                {/* Stock Filter */}
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
              </div>
            </div>
          </Drawer>

          {/* Mobile Right Drawer (Preview placeholder) */}
          <Drawer
            anchor="bottom"
            open={rightDrawerOpen}
            onClose={() => setRightDrawerOpen(false)}
          >
            <div className=" p-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={() => setRightDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              {/* Sort Filter with Lucide Radio Icons */}
              <div>
                <Typography variant="subtitle1" className="mb-2">
                  Sort By:
                </Typography>
                <div className="flex flex-col gap-2">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "" },
                      })
                    }
                  >
                    {filters.sort === "" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <Radio className="mr-2 text-secondary" size={20} />
                    )}
                    <Typography
                      className={
                        filters.sort === ""
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      None
                    </Typography>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "price_high" },
                      })
                    }
                  >
                    {filters.sort === "price_high" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <ArrowUp10 className="mr-2 text-secondary" size={20} />
                    )}
                    <Typography
                      className={
                        filters.sort === "price_high"
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      Price: High to Low
                    </Typography>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "price_low" },
                      })
                    }
                  >
                    {filters.sort === "price_low" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <ArrowDown01 className="mr-2 text-secondary" size={20} />
                    )}
                    <Typography
                      className={
                        filters.sort === "price_low"
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      Price: Low to High
                    </Typography>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "name_asc" },
                      })
                    }
                  >
                    {filters.sort === "name_asc" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <ArrowDownAZ className="mr-2 text-secondary" size={20} />
                    )}
                    <Typography
                      className={
                        filters.sort === "name_asc"
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      Name: A to Z
                    </Typography>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "name_desc" },
                      })
                    }
                  >
                    {filters.sort === "name_desc" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <ArrowUpAZ className="mr-2 text-secondary" size={20} />
                    )}
                    <Typography
                      className={
                        filters.sort === "name_desc"
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      Name: Z to A
                    </Typography>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "latest" },
                      })
                    }
                  >
                    {filters.sort === "latest" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <ArrowUpNarrowWide
                        className="mr-2 text-secondary"
                        size={20}
                      />
                    )}
                    <Typography
                      className={
                        filters.sort === "latest"
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      Latest
                    </Typography>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "sort", value: "oldest" },
                      })
                    }
                  >
                    {filters.sort === "oldest" ? (
                      <Circle className="mr-2 text-primary" size={20} />
                    ) : (
                      <ArrowDownNarrowWide
                        className="mr-2 text-secondary"
                        size={20}
                      />
                    )}
                    <Typography
                      className={
                        filters.sort === "oldest"
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      Oldest
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>

          {/* Desktop Filters */}
          <div className="hidden md:block">
            <Grid container spacing={2}>
              {/* Category Filter */}
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
                    {memoizedCategories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Flag Filter */}
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

              {/* Stock Filter */}
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

              {/* Sort Filter */}
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

              {/* Items per page */}
              <Grid item xs={6} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Items per page</InputLabel>
                  <Select
                    name="itemsPerPage"
                    value={filters.limit}
                    onChange={handleItemsPerPageChange}
                    label="Items per page"
                  >
                    {[5, 10, 20, 50].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>

          {/* No Product Message */}
          {products.length === 0 ? (
            <Typography
              variant="body1"
              className="text-center text-gray-500 p-20 md:p-70 shadow rounded-lg"
            >
              No products found. Please check back later!
            </Typography>
          ) : (
            <ProductList products={products} />
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border
                ${currentPage === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-gray-500 hover:bg-gray-100"}`}
            >
              <ChevronLeft size={18} />
              <span className="hidden md:block">Previous</span>
            </button>

            <p className={"flex"}>
              <span>
                Page {currentPage} of {totalPages}
              </span>

              <span className={"hidden md:block"}>
                || Total Products {totalProducts}
              </span>
            </p>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border
                ${currentPage >= totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-gray-500 hover:bg-gray-100"}`}
            >
              <span className="hidden md:block">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
