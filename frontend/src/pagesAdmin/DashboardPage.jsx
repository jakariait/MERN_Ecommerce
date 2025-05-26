import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import OrdersPieChart from "../component/componentAdmin/OrdersPieChart.jsx";
import DailyOrdersChart from "../component/componentAdmin/DailyOrdersChart.jsx";
import MostSoldProductsChart from "../component/componentAdmin/MostSoldProductsChart.jsx";
import MonthlyRevenueChart from "../component/componentAdmin/MonthlyRevenueChart.jsx";
import MonthlyOrderStatusRatioChart from "../component/componentAdmin/MonthlyOrderStatusRatioChart.jsx";

const DashboardPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Dashboard"} pageDetails={"WEBSITE CONFIG"} />
        <div className={"flex flex-col gap-8"}>
          <div className={"grid md:grid-cols-2 gap-4"}>
            <OrdersPieChart />
            <MostSoldProductsChart />
          </div>
          <DailyOrdersChart />
          <MonthlyRevenueChart />
          <MonthlyOrderStatusRatioChart />
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default DashboardPage;
