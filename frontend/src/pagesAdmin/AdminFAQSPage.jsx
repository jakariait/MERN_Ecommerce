import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminFAQSection from "../component/componentAdmin/AdminFAQSection.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ABOUT US" title="Update About Us" />
      <AdminFAQSection/>
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
