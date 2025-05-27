import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminCreate from "../component/componentAdmin/AdminCreate.jsx";

const CreateAdminPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SYSTEM USERS" title="Create System User" />
      <AdminCreate/>
    </LayoutAdmin>
  );
};

export default CreateAdminPage;