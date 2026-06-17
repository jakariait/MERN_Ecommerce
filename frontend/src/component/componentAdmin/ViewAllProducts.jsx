import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  Pagination,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import useProductStore from "../../store/useProductStore.js";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import { FaEye, FaRegEdit, FaCopy, FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import RequirePermission from "./RequirePermission.jsx";

const ViewAllProducts = () => {
  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    fetchProductsAdmin,
    deleteProduct,
    duplicateProduct,
  } = useProductStore();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const activeCount = useMemo(
    () => products.filter((p) => p.isActive).length,
    [products],
  );
  const inactiveCount = useMemo(
    () => products.filter((p) => !p.isActive).length,
    [products],
  );

  useEffect(() => {
    fetchProductsAdmin(filters);
  }, [filters.page, filters.limit, fetchProductsAdmin]);

  useEffect(() => {
    setFilteredProducts(
      products
        .filter((product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
  }, [filters.search, products]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenDialog = (id) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setSnackbar({
        open: true,
        message: `Product ID ${selectedProductId} deleted successfully!`,
        type: "success",
      });
      fetchProductsAdmin(filters);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete product.",
        type: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateProduct(id);
      setSnackbar({
        open: true,
        message: `Product duplicated successfully!`,
        type: "success",
      });
      fetchProductsAdmin(filters);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to duplicate product.",
        type: "error",
      });
    }
  };

  if (loading)
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton height={32} width={200} />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Skeleton height={90} />
          <Skeleton height={90} />
          <Skeleton height={90} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton height={40} width={320} />
          <Skeleton height={40} width={200} />
        </div>
        <Skeleton height={400} className="rounded-lg" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton height={20} width={200} />
          <Skeleton height={32} width={300} />
        </div>
      </div>
    );

  if (error) return (
    <div className="p-6">
      <Alert severity="error">{error}</Alert>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold primaryTextColor">Product List</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-[#00395d]">
          <Typography variant="h4" fontWeight={700} color="#00395d">
            {products.length}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Products
          </Typography>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-green-500">
          <Typography variant="h4" fontWeight={700} color="#16a34a">
            {activeCount}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Active
          </Typography>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-red-500">
          <Typography variant="h4" fontWeight={700} color="#dc2626">
            {inactiveCount}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Inactive
          </Typography>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <TextField
          placeholder="Search products..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
        <div className="flex items-center gap-2">
          <Typography variant="body2" color="textSecondary">
            Show
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={filters.limit}
              onChange={handleFilterChange}
              name="limit"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="textSecondary">
            entries
          </Typography>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderRadius: 2,
          border: "1px solid #e5e7eb",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", display: { xs: "none", md: "table-cell" } }}>
                Stock
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", display: { xs: "none", md: "table-cell" } }}>
                Flags
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="textSecondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.15s",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", color: "#6b7280" }}
                    >
                      #{product.productId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className="relative group">
                      <ImageComponent
                        imageName={product?.thumbnailImage}
                        altName={product?.name}
                        skeletonHeight={30}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {product?.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category?.name || "—"}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1, fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    {product.variants?.length ? (
                      <div>
                        <Typography variant="body2" fontWeight={600}>
                          ৳{Math.min(...product.variants.map((v) => v.price))}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {product.variants.length} var.
                        </Typography>
                      </div>
                    ) : (
                      <div>
                        <Typography variant="body2" fontWeight={600}>
                          ৳{product.finalPrice}
                        </Typography>
                        {product.finalDiscount > 0 && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#ef4444", textDecoration: "line-through" }}
                          >
                            ৳{product.finalDiscount}
                          </Typography>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.finalStock > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {product.finalStock > 0
                          ? `${product.finalStock} in stock`
                          : "Out of stock"}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <div className="flex gap-1 flex-wrap">
                      {product.flags?.length ? (
                        product.flags.map((flag, i) => (
                          <Chip
                            key={i}
                            label={flag.name}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ borderRadius: 1 }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          —
                        </Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={product.isActive ? "success" : "default"}
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                        backgroundColor: product.isActive
                          ? "#dcfce7"
                          : "#f3f4f6",
                        color: product.isActive ? "#16a34a" : "#6b7280",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-1 justify-center">
                      <Tooltip title="View Product">
                        <IconButton
                          size="small"
                          component="a"
                          href={`/product/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: "#00395d" }}
                        >
                          <FaEye className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <RequirePermission
                        permission="edit_products"
                        fallback={true}
                      >
                        <Tooltip title="Edit Product">
                          <IconButton
                            size="small"
                            component={Link}
                            to={`/admin/edit-product/${product.slug}`}
                            sx={{ color: "#00395d" }}
                          >
                            <FaRegEdit className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </RequirePermission>
                      <RequirePermission
                        permission="add_products"
                        fallback={true}
                      >
                        <Tooltip title="Duplicate">
                          <IconButton
                            size="small"
                            onClick={() => handleDuplicate(product.id)}
                            sx={{ color: "#00395d" }}
                          >
                            <FaCopy className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </RequirePermission>
                      <RequirePermission
                        permission="delete_products"
                        fallback={true}
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(product.id)}
                            sx={{ color: "#ef4444" }}
                          >
                            <MdDeleteOutline className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </RequirePermission>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-between items-center mt-4">
        <Typography variant="body2" color="textSecondary">
          Showing{" "}
          {products.length > 0
            ? (currentPage - 1) * filters.limit + 1
            : 0}{" "}
          to{" "}
          {Math.min(
            currentPage * filters.limit,
            (currentPage - 1) * filters.limit + filteredProducts.length,
          )}{" "}
          of {products.length} products
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handlePageChange(page)}
          color="primary"
          shape="rounded"
          size="medium"
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 500,
            },
          }}
        />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewAllProducts;