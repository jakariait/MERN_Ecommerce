import { useEffect } from "react";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import useBreadcrumbStore from "../store/BreadcrumbStore.js";

const ReturnedOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb("ORDERS", "View All Returned Orders");
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <AllOrders title={"Returned Orders"} status={"returned"} />
    </RequirePermission>
  );
};

export default ReturnedOrdersPage;
