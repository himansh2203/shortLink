'use client';
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatsChartProps {
  labels: string[];
  values: number[];
}

export default function StatsChart({ labels, values }: StatsChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Clicks",
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: { x: { display: true }, y: { display: true, beginAtZero: true } },
  };

  return (
    <div style={{ width: "100%", height: 260 }}>
      <Line data={data} options={options} />
    </div>
  );
}