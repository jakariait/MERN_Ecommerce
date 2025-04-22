import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import OrderStats from "../component/componentAdmin/OrderStats.jsx";

const AddNewCategoryPage = () => {
  const { allOrders, orderListLoading, orderListError } = useOrderStore();

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Orders" />
      {/* Order status totals */}
      <OrderStats orders={allOrders} />
      <AllOrders
        allOrders={allOrders}
        orderListLoading={orderListLoading}
        orderListError={orderListError}
        title={"All Orders"}
      />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
