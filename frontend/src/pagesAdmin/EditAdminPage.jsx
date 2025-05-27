import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditAdmin from "../component/componentAdmin/EditAdmin.jsx";

const EditAdminPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SYSTEM USERS" title="Update System User" />
      <EditAdmin/>
    </LayoutAdmin>
  );
};

export default EditAdminPage;