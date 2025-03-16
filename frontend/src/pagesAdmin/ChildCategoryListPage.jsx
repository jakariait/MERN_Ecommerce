import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ChildCategoryManager from "../component/componentAdmin/ChildCategoryManager.jsx";

const ChildCategoryListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails="CHILD CATEGORY"
        title="View All Child Categories"
      />
      <ChildCategoryManager />
    </LayoutAdmin>
  );
};

export default ChildCategoryListPage;
