import React, {useEffect} from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const AddNewCategoryPage = () => {
  const {
    orderListByStatus,
    orderListLoading,
    orderListError,
    fetchAllOrders,
  } = useOrderStore();

  useEffect(() => {
    fetchAllOrders("approved");
  }, [fetchAllOrders]);

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Approved Orders" />
      <AllOrders
        allOrders={orderListByStatus.approved}
        orderListLoading={orderListLoading}
        orderListError={orderListError}
        title={"Approved Orders"}
      />
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
