import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useOrderStore from "../../store/useOrderStore.js";

const COLORS = [
  "#1976d2", // Blue - Pending
  "#2e7d32", // Green - Approved
  "#f9a825", // Yellow - In Transit
  "#0288d1", // Light Blue - Delivered
  "#d32f2f", // Red - Returned
  "#757575", // Grey - Cancelled
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontWeight: "bold", fontSize: 12 }}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  ) : null;
};

const CustomLegend = ({ payload }) => (
  <div className="grid grid-cols-3 justify-center items-center gap-2 mt-4">
    {payload.map((entry, index) => (
      <div
        key={`item-${index}`}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <div
          style={{ backgroundColor: entry.color }}
          className="w-3 h-3 rounded-full"
        />
        <span className="text-sm font-semibold text-gray-700">
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

export default function OrdersPieChart() {
  const { totalByStatus } = useOrderStore();

  // Build dynamic data from the store
  const data = [
    { name: "Pending", value: totalByStatus.pending || 0 },
    { name: "Approved", value: totalByStatus.approved || 0 },
    { name: "In Transit", value: totalByStatus.intransit || 0 },
    { name: "Delivered", value: totalByStatus.delivered || 0 },
    { name: "Returned", value: totalByStatus.returned || 0 },
    { name: "Cancelled", value: totalByStatus.cancelled || 0 },
  ];

  const totalOrders = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow py-8 ">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-bold mb-1">Order Status Breakdown</h2>
        <p className="text-gray-500 font-medium">Total Orders: {totalOrders}</p>
      </div>
      <div className="flex justify-center h-72">
        <ResponsiveContainer width={300} height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor={entry.value > 0 ? "pointer" : "default"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, `${name} Orders`]}
            />
            <Legend content={CustomLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
