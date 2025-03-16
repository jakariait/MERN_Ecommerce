import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import ContactTable from "../component/componentAdmin/ContactTable.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";

const ContactRequestPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails=" CONTACT REQUEST" title="View All Contact Request"/>
      <ContactTable />
    </LayoutAdmin>
  );
};

export default ContactRequestPage;
