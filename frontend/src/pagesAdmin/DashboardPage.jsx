import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import Dashboard from "../component/componentAdmin/Dashboard.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Dashboard"} pageDetails={"WEBSITE CONFIG"} />

        <Dashboard />
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
