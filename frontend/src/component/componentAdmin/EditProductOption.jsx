import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductOptionStore from '../../store/useProductOptionStore';
import {
  TextField,
  Button,
  Snackbar,
  CircularProgress,
} from '@mui/material';

const EditProductOption = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProductOption, fetchProductOptionById, updateProductOption, loading, error } = useProductOptionStore();

  const [name, setName] = useState('');
  const [values, setValues] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductOptionById(id);
    };
    fetchData();
  }, [fetchProductOptionById, id]);

  useEffect(() => {
    if (selectedProductOption) {
      setName(selectedProductOption.name || '');
      setValues(selectedProductOption.values ? selectedProductOption.values.join(', ') : '');
    }
  }, [selectedProductOption]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !values.trim()) {
      setSnackbarMessage('Name and values are required');
      setOpenSnackbar(true);
      return;
    }

    const valuesArray = values.split(',').map(v => v.trim()).filter(v => v);
    const data = { name, values: valuesArray };

    try {
      await updateProductOption(id, data);
      setSnackbarMessage('Product option updated successfully!');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/admin/product-options');
      }, 2000);
    } catch (err) {
      setSnackbarMessage(error || 'Failed to update product option');
      setOpenSnackbar(true);
    }
  };

  if (loading && !selectedProductOption) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedProductOption) {
    return <div>No product option found for the provided ID.</div>;
  }

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Edit Product Option
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-5">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={!name}
          helperText={!name ? 'Name is required' : ''}
        />

        <TextField
          label="Values (comma-separated)"
          value={values}
          onChange={(e) => setValues(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={!values}
          helperText={!values ? 'Values are required' : ''}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Saving...' : 'Update Product Option'}
          </Button>
        </div>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </div>
  );
};

export default EditProductOption;
