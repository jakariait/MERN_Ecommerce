import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditSubCategory from "../component/componentAdmin/EditSubCategory.jsx";

const EditSubCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SUB CATEGORY" title="Edit Sub Categories" />
      <EditSubCategory/>
    </LayoutAdmin>
  );
};

export default EditSubCategoryPage;