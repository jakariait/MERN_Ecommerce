import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const AddNewCategoryPage = () => {
  const { orderListByStatus, orderListLoading, orderListError } =
    useOrderStore();

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Pending Orders" />
      <AllOrders
        allOrders={orderListByStatus.pending}
        orderListLoading={orderListLoading}
        orderListError={orderListError}
        title={"Pending Orders"}
      />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
