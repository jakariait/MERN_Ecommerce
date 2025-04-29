import React, {useEffect} from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const AddNewCategoryPage = () => {
  const { orderListByStatus, orderListLoading, orderListError,fetchAllOrders,} =
    useOrderStore();

  useEffect(() => {
    fetchAllOrders("cancelled");
  }, [fetchAllOrders]);

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Cancelled Orders" />
      <AllOrders
        allOrders={orderListByStatus.cancelled}
        orderListLoading={orderListLoading}
        orderListError={orderListError}
        title={"Cancelled Orders"}
      />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
