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
  const voltageThresholds = data.thresholdValues.voltage;

  // Create chart data
  const chartData = {
    labels: data.mappedData.time, // Correct time mapping
    datasets: [
      {
        label: 'Voltage V1',
        data: data.mappedData.voltage.V1, // Correct voltage mapping for V1
        borderColor: 'rgba(34, 202, 236, 1)',
        backgroundColor: 'rgba(34, 202, 236, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Voltage V2',
        data: data.mappedData.voltage.V2, // Correct voltage mapping for V2
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Voltage V3',
        data: data.mappedData.voltage.V3, // Correct voltage mapping for V3
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        fill: chartType === 'area',
      },
      // Adding threshold lines for each phase
      {
        label: 'V1 High Threshold',
        data: new Array(data.mappedData.time.length).fill(voltageThresholds.VL1), // V1 high threshold
        borderColor: 'rgba(255, 0, 0, 0.5)', // Red dashed line for high thresholds
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'V2 High Threshold',
        data: new Array(data.mappedData.time.length).fill(voltageThresholds.VL2), // V2 high threshold
        borderColor: 'rgba(255, 0, 0, 0.5)', // Red dashed line for high thresholds
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'V3 High Threshold',
        data: new Array(data.mappedData.time.length).fill(voltageThresholds.VL3), // V3 high threshold
        borderColor: 'rgba(255, 0, 0, 0.5)', // Red dashed line for high thresholds
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
