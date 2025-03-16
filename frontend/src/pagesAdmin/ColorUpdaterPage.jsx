import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ColorUpdater from "../component/componentAdmin/ColorUpdater.jsx";

const ColorUpdaterPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails="WEBSITE CONFIG"
        title="Website Theme Color"
      />
      <ColorUpdater />
    </LayoutAdmin>
  );
};

export default ColorUpdaterPage;
