import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import UpdateProduct from "../component/componentAdmin/UpdateProduct.jsx";

const EditProductPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT" title="Edit Product" />
      <UpdateProduct />
    </LayoutAdmin>
  );
};

export default EditProductPage;
