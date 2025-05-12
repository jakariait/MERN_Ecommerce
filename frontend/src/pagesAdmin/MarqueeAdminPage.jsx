import React from "react";
import GeneralInfoForm from "../component/componentAdmin/GeneralInfoForm.jsx";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import MarqueeAdmin from "../component/componentAdmin/MarqueeAdmin.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Scroll Text"} pageDetails={"WEBSITE CONFIG"} />
        {/* Form Section */}
        <MarqueeAdmin/>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
