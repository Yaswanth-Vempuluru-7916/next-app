import React from 'react';
import GenericChart from '../GenericChart';

const VoltageChart = ({ chartType, data }) => {
  if (!data) return null;

  // Extract threshold values for voltage
  const voltageThresholds = data.thresholdValues.voltage;

  // Create chart data
  const chartData = {
    labels: data.mappedData.time,
    datasets: [
      {
        label: 'Voltage V1',
        data: data.mappedData.voltage.V1,
        borderColor: 'rgba(34, 202, 236, 1)',
        backgroundColor: 'rgba(34, 202, 236, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Voltage V2',
        data: data.mappedData.voltage.V2,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Voltage V3',
        data: data.mappedData.voltage.V3,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'V1 High Threshold',
        data: new Array(data.mappedData.time.length).fill(voltageThresholds.VL1),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'V2 High Threshold',
        data: new Array(data.mappedData.time.length).fill(voltageThresholds.VL2),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'V3 High Threshold',
        data: new Array(data.mappedData.time.length).fill(voltageThresholds.VL3),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Voltage Measurements`,
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
          text: 'Voltage (V)',
        },
      },
    },
  };

  return <GenericChart chartType={chartType} data={chartData} options={options} />;
};

export default VoltageChart;
