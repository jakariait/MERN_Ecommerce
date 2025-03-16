import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditChildCategory from "../component/componentAdmin/EditChildCategory.jsx";

const EditChildCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CHILD CATEGORY" title="Edit Child Categories" />
      <EditChildCategory/>
    </LayoutAdmin>
  );
};

export default EditChildCategoryPage;