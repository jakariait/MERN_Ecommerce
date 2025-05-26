import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddProductSize from "../component/componentAdmin/AddProductSize.jsx";
import ProductSizeManager from "../component/componentAdmin/ProductSizeManager.jsx";

const AddNewProductSizePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="Add New Product Size" />
      <AddProductSize />
    </LayoutAdmin>
  );
};

export default AddNewProductSizePage;
