import { useEffect } from "react";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import useBreadcrumbStore from "../store/BreadcrumbStore.js";

const CancelledOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb("ORDERS", "View All Cancelled Orders");
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <AllOrders title={"Cancelled Orders"} status={"cancelled"} />
    </RequirePermission>
  );
};

export default CancelledOrdersPage;
