import React, { useEffect } from "react";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import useBreadcrumbStore from "../store/BreadcrumbStore.js";

const PendingOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb("ORDERS", "View All Pending Orders");
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <AllOrders title={"Pending Orders"} status={"pending"} />
    </RequirePermission>
  );
};

export default PendingOrdersPage;
