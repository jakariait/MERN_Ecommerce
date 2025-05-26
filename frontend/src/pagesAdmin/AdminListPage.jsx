import React, { useState } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminList from "../component/componentAdmin/AdminList.jsx";
import AdminCreate from "../component/componentAdmin/AdminCreate.jsx";

const AdminListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        title={"View All System Users"}
        pageDetails={"SYSTEM USERS"}
      />
      <AdminList />
      <AdminCreate />

    </LayoutAdmin>
  );
};

export default AdminListPage;
