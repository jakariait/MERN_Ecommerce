import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import SubscribersList from "../component/componentAdmin/SubscribersList.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";

const SubscribedUsersPage = ({ title, pageDetails }) => {
  return (
    <LayoutAdmin>
      <div>
        {/* Breadcrumb Section */}
        <Breadcrumb title={"View All Subscribed Users"} pageDetails={"USER SUBSCRIPTION"} />

        {/* Form Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <SubscribersList/>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default SubscribedUsersPage;
