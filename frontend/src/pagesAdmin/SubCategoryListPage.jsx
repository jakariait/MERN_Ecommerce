import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import SubCategoryManager from "../component/componentAdmin/SubCategoryManager.jsx";

const SubCategoryListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SUB CATEGORY" title="View All Sub Categories" />
      <SubCategoryManager />
    </LayoutAdmin>
  );
};

export default SubCategoryListPage;
