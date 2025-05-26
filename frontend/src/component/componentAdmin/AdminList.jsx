import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import PermissionsCheckboxGroup from "./PermissionsCheckboxGroup.jsx";

const AdminList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  // Create dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });

  // Update dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState({
    id: "",
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });
  const [updating, setUpdating] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/admin/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data.admins);
    } catch (error) {
      showSnackbar("error", "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (adminId) => {
    setSelectedAdminId(adminId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${apiUrl}/admin/${selectedAdminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("success", "Admin deleted successfully");
      fetchAdmins();
    } catch (error) {
      showSnackbar("error", "Failed to delete admin");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedAdminId(null);
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const showSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCreateChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async () => {
    setCreating(true);
    try {
      await axios.post(`${apiUrl}/admin/create`, newAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("success", "Admin created successfully");
      setNewAdmin({ name: "", email: "", mobileNo: "", password: "" });
      setOpenCreateDialog(false);
      fetchAdmins();
    } catch (error) {
      showSnackbar(
        "error",
        error.response?.data?.message || "Failed to create admin",
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        View and Create Admins
      </h1>
      <div className={"flex justify-center mb-4"}>
        <button
          className={
            "primaryBgColor accentTextColor px-4 py-2 rounded-md cursor-pointer"
          }
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Admin
        </button>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile No.</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin, index) => (
              <TableRow key={admin._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.mobileNo || "-"}</TableCell>
                <TableCell>
                  {new Date(admin.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingAdmin({
                          id: admin._id,
                          name: admin.name,
                          email: admin.email,
                          mobileNo: admin.mobileNo || "",
                          password: "",
                        });
                        setOpenEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(admin._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this admin?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        fullWidth
      >
        <DialogTitle>Create New Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newAdmin.name}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newAdmin.email}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            type="email"
          />
          <TextField
            label="Mobile No"
            name="mobileNo"
            value={newAdmin.mobileNo}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            value={newAdmin.password}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            type="password"
          />
          <PermissionsCheckboxGroup
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateSubmit}
            variant="contained"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/*Edit Dialog*/}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
      >
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editingAdmin.name}
            onChange={(e) =>
              setEditingAdmin({ ...editingAdmin, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={editingAdmin.email}
            onChange={(e) =>
              setEditingAdmin({ ...editingAdmin, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile No"
            name="mobileNo"
            value={editingAdmin.mobileNo}
            onChange={(e) =>
              setEditingAdmin({ ...editingAdmin, mobileNo: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password (optional)"
            name="password"
            type="password"
            value={editingAdmin.password}
            onChange={(e) =>
              setEditingAdmin({ ...editingAdmin, password: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              setUpdating(true);
              try {
                const payload = {
                  name: editingAdmin.name,
                  email: editingAdmin.email,
                  mobileNo: editingAdmin.mobileNo,
                };

                if (editingAdmin.password) {
                  payload.password = editingAdmin.password;
                }

                await axios.patch(
                  `${apiUrl}/admin/${editingAdmin.id}`,
                  payload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                showSnackbar("success", "Admin updated successfully");
                setOpenEditDialog(false);
                fetchAdmins();
              } catch (error) {
                showSnackbar(
                  "error",
                  error.response?.data?.message || "Failed to update admin",
                );
              } finally {
                setUpdating(false);
              }
            }}
            variant="contained"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminList;
