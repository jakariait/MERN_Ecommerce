import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddProduct from "../component/componentAdmin/AddProduct.jsx";

const AddNewProductPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT" title="Add New Product" />
      <AddProduct/>
    </LayoutAdmin>
  );
};

export default AddNewProductPage;