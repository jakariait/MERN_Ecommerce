import React from "react";
import GeneralInfoForm from "../component/componentAdmin/GeneralInfoForm.jsx";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"General Info"} pageDetails={"WEBSITE CONFIG"} />
        {/* Form Section */}
        <GeneralInfoForm />
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
