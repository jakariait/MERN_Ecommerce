import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditProductSize from "../component/componentAdmin/EditProductSize.jsx";

const EditProductSizePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="View all Product Size" />
      <EditProductSize />
    </LayoutAdmin>
  );
};

export default EditProductSizePage;
