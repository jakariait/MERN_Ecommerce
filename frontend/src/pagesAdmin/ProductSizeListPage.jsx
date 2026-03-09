import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ProductSizeManager from "../component/componentAdmin/ProductSizeManager.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import ProductOptionManager from "../component/componentAdmin/ProductOptionManager.jsx";

const ProductSizeListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="View all Product Size" />
      <RequirePermission permission="product_size" >
        <ProductSizeManager />
        <ProductOptionManager/>
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default ProductSizeListPage;
