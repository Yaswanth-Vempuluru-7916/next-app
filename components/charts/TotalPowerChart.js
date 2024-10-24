import React from 'react';
import GenericChart from '../GenericChart';

const TotalPowerChart = ({ chartType, data }) => {
  if (!data) return null;

  // Extract threshold values for power
  const { thresholdValues } = data;
  const powerThresholds = thresholdValues.power;

  const chartData = {
    labels: data.mappedData.time,
    datasets: [
      {
        label: 'Total Power (KW)',
        data: data.mappedData.power.Total.KW,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KW Threshold',
        data: new Array(data.mappedData.time.length).fill(powerThresholds.KW),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      }
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Power',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Power (KW)',
        },
      },
    },
  };

  return <GenericChart chartType={chartType} data={chartData} options={options} />;
};

export default TotalPowerChart;
