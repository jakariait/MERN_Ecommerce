import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import SocialMediaLinks from "../component/componentAdmin/SocialMediaLinks.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";

const SocialLinkUpdaterPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails={"WEBSITE CONFIG"}
        title={"Social Media Links"}
      />
      <SocialMediaLinks />
    </LayoutAdmin>
  );
};

export default SocialLinkUpdaterPage;
