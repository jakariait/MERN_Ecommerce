import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import PageEditor from "../component/componentAdmin/PageEditor.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ABOUT US" title="Update About Us" />
      <PageEditor title="About Us" endpoint="about" />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
