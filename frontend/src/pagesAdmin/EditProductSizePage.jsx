import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import EditProductOption from "../component/componentAdmin/EditProductOption.jsx";

const EditProductSizePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="View all Product Size" />
      <RequirePermission permission="product_size">
        <EditProductOption/>
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default EditProductSizePage;
