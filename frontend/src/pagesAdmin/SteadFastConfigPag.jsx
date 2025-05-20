import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminSteadfastConfig from "../component/componentAdmin/AdminSteadfastConfig.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Steadfast API"} pageDetails={"WEBSITE CONFIG"} />

        <AdminSteadfastConfig/>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
