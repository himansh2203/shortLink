import React from 'react';
import { Line } from 'react-chartjs-2';

interface StatsChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Click Statistics',
        data: data.values,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default StatsChart;