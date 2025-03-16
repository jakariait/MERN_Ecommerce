import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditCategory from "../component/componentAdmin/EditCategory.jsx";

const EditCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CATEGORY" title="View All Categories" />
      <EditCategory/>
    </LayoutAdmin>
  );
};

export default EditCategoryPage;