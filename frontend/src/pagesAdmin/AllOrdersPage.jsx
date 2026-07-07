import { useEffect } from "react";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import OrderStats from "../component/componentAdmin/OrderStats.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AdminNewOrderCreate from "../component/componentAdmin/AdminNewOrderCreate.jsx";
import useBreadcrumbStore from "../store/BreadcrumbStore.js";

const AllOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb("ORDERS", "View All Orders");
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <div className={"flex items-center justify-center"}>
        <AdminNewOrderCreate />
      </div>
      <OrderStats />
      <AllOrders title={"All Orders"} />
    </RequirePermission>
  );
};

export default AllOrdersPage;
