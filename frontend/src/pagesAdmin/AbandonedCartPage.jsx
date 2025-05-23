import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AbandonedCartsContainer from "../component/componentAdmin/AbandonedCartsContainer.jsx";

const AbandonedCartPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="INCOMPLETE ORDER" title="View All Incomplete Orders" />
      <AbandonedCartsContainer />
    </LayoutAdmin>
  );
};

export default AbandonedCartPage;
