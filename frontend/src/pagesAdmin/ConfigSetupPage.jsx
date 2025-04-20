import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ConfigSetup from "../component/componentAdmin/ConfigSetup.jsx";

const ConfigSetupPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CONFIG" title="Setup Config" />
      <ConfigSetup />
    </LayoutAdmin>
  );
};

export default ConfigSetupPage;
