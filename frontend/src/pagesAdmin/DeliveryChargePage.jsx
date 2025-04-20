import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import DeliveryCharge from "../component/componentAdmin/DeliveryCharge.jsx";
import CreateShippingDialog from "../component/componentAdmin/CreateShipping.jsx";

const DeliveryChargePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="DELIVERY CHARGE" title="View All Deivery Charges" />
      <div className="flex flex-col gap-16">
        <CreateShippingDialog />
        <DeliveryCharge/>
      </div>

    </LayoutAdmin>
  );
};

export default DeliveryChargePage;