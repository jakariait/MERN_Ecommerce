import React from 'react';
import OrdersPieChart from "./OrdersPieChart.jsx";

const Dashboard = () => {
  return (
    <div className={"grid md:grid-cols-2 gap-4"}>
      <OrdersPieChart/>
    </div>
  );
};

export default Dashboard;