import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ProductSizeManager from "../component/componentAdmin/ProductSizeManager.jsx";

const ProductSizeListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="View all Product Size" />
      <ProductSizeManager />
    </LayoutAdmin>
  );
};

export default ProductSizeListPage;
