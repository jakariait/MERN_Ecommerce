import React from "react";
import CustomerList from "../component/componentAdmin/CustomerList.jsx";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";

const CustomerListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CUSTOMERS" title="View All Customers"/>
      <CustomerList />
    </LayoutAdmin>
  );
};

export default CustomerListPage;
