import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import CouponTable from "../component/componentAdmin/CouponTable.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PROMO CODE" title="View and Create Promo Code" />
      <CouponTable/>
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
