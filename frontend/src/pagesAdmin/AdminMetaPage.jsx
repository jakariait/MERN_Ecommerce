import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminMetaForm from "../component/componentAdmin/AdminMetaForm.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"SEO for HomePage"} pageDetails={"WEBSITE CONFIG"} />
        {/* Form Section */}
        <AdminMetaForm />
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
