import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddSubCategory from "../component/componentAdmin/AddSubCategory.jsx";

const AddNewSubCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SUB CATEGORY" title="View All Sub Categories" />
      {/* AddSubCategory component */}
      <AddSubCategory />
    </LayoutAdmin>
  );
};

export default AddNewSubCategoryPage;
