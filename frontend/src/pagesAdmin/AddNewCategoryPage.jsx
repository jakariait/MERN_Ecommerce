import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddCategory from "../component/componentAdmin/AddCategory.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CATEGORY" title="View All Categories" />
      <AddCategory />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
