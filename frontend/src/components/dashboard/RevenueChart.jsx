import React from "react";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, Title,
  Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

const RevenueChart = ({ data, type = "line", title = "Revenue Trend" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        <div className="h-64 flex-center text-secondary-400">
          No data available
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.monthName?.substring(0, 3) || d.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.map((d) => d.revenue || 0),
        borderColor: "#f97316",
        backgroundColor:
          type === "line"
            ? "rgba(249, 115, 22, 0.1)"
            : "rgba(249, 115, 22, 0.8)",
        borderWidth: 2,
        fill: type === "line",
        tension: 0.4,
        pointBackgroundColor: "#f97316",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          color: "#64748b",
          callback: (val) => "₹" + (val / 1000).toFixed(0) + "k",
        },
      },
    },
  };

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="h-64">
        {type === "line" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default RevenueChart;