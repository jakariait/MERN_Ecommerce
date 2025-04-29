import React, {useEffect} from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const AddNewCategoryPage = () => {
  const { orderListByStatus, orderListLoading, orderListError,fetchAllOrders } =
    useOrderStore();


  useEffect(() => {
    fetchAllOrders("delivered");
  }, [fetchAllOrders]);


  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Delivered Orders" />
      <AllOrders
        allOrders={orderListByStatus.delivered}
        orderListLoading={orderListLoading}
        orderListError={orderListError}
        title={"Delivered Orders"}
      />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
