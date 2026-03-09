import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddProductSize from "../component/componentAdmin/AddProductSize.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AddProductOption from "../component/componentAdmin/AddProductOption.jsx";

const AddNewProductSizePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="Add New Product Size" />
      <RequirePermission permission="product_size" >
        <AddProductSize />
        <AddProductOption/>
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default AddNewProductSizePage;
