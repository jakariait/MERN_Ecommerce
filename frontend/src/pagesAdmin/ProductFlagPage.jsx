import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import FlagsComponent from "../component/componentAdmin/FlagsComponent.jsx";

const ProductFlagPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT FLAG" title="View All Product Flags" />
      <FlagsComponent/>
    </LayoutAdmin>
  );
};

export default ProductFlagPage;