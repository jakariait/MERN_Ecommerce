import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  TextField,
  TablePagination,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useProductOptionStore from "../../store/useProductOptionStore.js";
import Skeleton from "react-loading-skeleton";

const ProductOptionManager = () => {
  const navigate = useNavigate();
  const { productOptions, loading, fetchProductOptions, deleteProductOption } =
    useProductOptionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchProductOptions();
  }, [fetchProductOptions]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      deleteProductOption(id);
      setSnackbarMessage("Option deleted successfully!");
      setOpenSnackbar(true);
    }
  };

  const filteredOptions = productOptions.filter((option) =>
    option.name?.toLowerCase().includes(searchTerm.toLowerCase() || ""),
  );

  return (
    <div className="shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
          Product Option List
        </h1>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div>
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Values</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOptions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((option) => (
                    <TableRow key={option._id}>
                      <TableCell>{option.name}</TableCell>
                      <TableCell>{option.values.join(', ')}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            navigate(`/admin/edit-product-option/${option._id}`)
                          }
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(option._id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOptions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
          />
        </>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default ProductOptionManager;