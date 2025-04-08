import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ViewAllProducts from "../component/componentAdmin/ViewAllProducts.jsx";

const ViewAllProductPage = () => {
  return (
    <LayoutAdmin>
      {/* Breadcrumb Section */}
      <Breadcrumb
        title={"View All Products"}
        pageDetails={"PRODUCTS"}
      />
      <ViewAllProducts />
    </LayoutAdmin>
  );
};

export default ViewAllProductPage;
