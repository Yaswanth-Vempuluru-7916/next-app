// components/charts/VoltageChart.js
import React from 'react';
import GenericChart from '../GenericChart';
import useFetchMeterData from '../../hooks/useFetchMeterData';
import { useRecoilValue } from 'recoil';
import { shouldFetchDataState } from '../../lib/atoms';

const VoltageChart = ({ selectedMeter, chartType }) => {
  const shouldFetchData = useRecoilValue(shouldFetchDataState);
  const { data, loading, error } = useFetchMeterData(selectedMeter, shouldFetchData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  // Extract threshold values for voltage
  const { threshold_values } = data;
  const voltageThresholds = threshold_values.voltage;

  // Create chart data
  const chartData = {
    labels: data.mappedData.time,  // Accessing time data correctly
    datasets: [
      {
        label: 'Voltage V1',
        data: data.mappedData.voltage.V1,  // Accessing V1 correctly
        borderColor: 'rgba(34, 202, 236, 1)',
        backgroundColor: 'rgba(34, 202, 236, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Voltage V2',
        data: data.mappedData.voltage.V2,  // Accessing V2 correctly
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Voltage V3',
        data: data.mappedData.voltage.V3,  // Accessing V3 correctly
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        fill: chartType === 'area',
      },
      // Adding threshold lines for each phase
      {
        label: 'V1 Threshold',
        data: new Array(data.time.length).fill(voltageThresholds.VL1.V1H), // High threshold for V1
        borderColor: 'rgba(255, 0, 0, 0.5)', // Red color for threshold line
        borderDash: [5, 5], // Dashed line
        fill: false,
      },
      {
        label: 'V2 Threshold',
        data: new Array(data.time.length).fill(voltageThresholds.VL2.V2H), // High threshold for V2
        borderColor: 'rgba(255, 0, 0, 0.5)', // Red color for threshold line
        borderDash: [5, 5], // Dashed line
        fill: false,
      },
      {
        label: 'V3 Threshold',
        data: new Array(data.time.length).fill(voltageThresholds.VL3.V3H), // High threshold for V3
        borderColor: 'rgba(255, 0, 0, 0.5)', // Red color for threshold line
        borderDash: [5, 5], // Dashed line
        fill: false,
      },
      {
        label: 'V1 Low Threshold',
        data: new Array(data.time.length).fill(voltageThresholds.VL1.V1L), // Low threshold for V1
        borderColor: 'rgba(0, 0, 255, 0.5)', // Blue color for threshold line
        borderDash: [5, 5], // Dashed line
        fill: false,
      },
      {
        label: 'V2 Low Threshold',
        data: new Array(data.time.length).fill(voltageThresholds.VL2.V2L), // Low threshold for V2
        borderColor: 'rgba(0, 0, 255, 0.5)', // Blue color for threshold line
        borderDash: [5, 5], // Dashed line
        fill: false,
      },
      {
        label: 'V3 Low Threshold',
        data: new Array(data.time.length).fill(voltageThresholds.VL3.V3L), // Low threshold for V3
        borderColor: 'rgba(0, 0, 255, 0.5)', // Blue color for threshold line
        borderDash: [5, 5], // Dashed line
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
        text: `Voltage`,
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
