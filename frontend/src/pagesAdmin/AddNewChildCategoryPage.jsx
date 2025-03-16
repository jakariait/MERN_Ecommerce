import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddChildCategory from "../component/componentAdmin/AddChildCategory.jsx";

const AddNewChildCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CHILD CATEGORY" title="Child Categories" />
      <AddChildCategory />
    </LayoutAdmin>
  );
};

export default AddNewChildCategoryPage;
