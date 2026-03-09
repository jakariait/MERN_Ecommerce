import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AddProductOption from "../component/componentAdmin/AddProductOption.jsx";

const AddNewProductSizePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT OPTIONS" title="Add New Product Options" />
      <RequirePermission permission="product_size" >
        <AddProductOption/>
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default AddNewProductSizePage;
