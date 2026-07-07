import React, {useEffect} from "react";
import OrdersPieChart from "../component/componentAdmin/OrdersPieChart.jsx";
import DailyOrdersChart from "../component/componentAdmin/DailyOrdersChart.jsx";
import MostSoldProductsChart from "../component/componentAdmin/MostSoldProductsChart.jsx";
import MonthlyRevenueChart from "../component/componentAdmin/MonthlyRevenueChart.jsx";
import MonthlyOrderStatusRatioChart from "../component/componentAdmin/MonthlyOrderStatusRatioChart.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import useBreadcrumbStore from "../store/BreadcrumbStore.js";

import useOrderStore from "../store/useOrderStore.js";

const DashboardPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb("WEBSITE CONFIG", "Dashboard");
  }, []);

  const { fetchAllOrders } = useOrderStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([

          fetchAllOrders(),
          fetchAllOrders("pending"),
          fetchAllOrders("approved"),
          fetchAllOrders("intransit"),
          fetchAllOrders("delivered"),
          fetchAllOrders("returned"),
          fetchAllOrders("cancelled"),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // ✅ Empty dependency array to prevent unnecessary re-renders





  return (
    <div>
      <RequirePermission permission="dashboard">
        <div className={"flex flex-col gap-8"}>
          <div className={"grid md:grid-cols-2 gap-4"}>
            <OrdersPieChart />
            <MostSoldProductsChart />
          </div>
          <DailyOrdersChart />
          <MonthlyRevenueChart />
          <MonthlyOrderStatusRatioChart />
        </div>
      </RequirePermission>
    </div>
  );
};

export default DashboardPage;
