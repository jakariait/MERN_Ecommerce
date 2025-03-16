import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import CategoryManager from "../component/componentAdmin/CategoryManager.jsx";

const CategoryListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CATEGORY" title="View All Categories" />
      <CategoryManager />
    </LayoutAdmin>
  );
};

export default CategoryListPage;
