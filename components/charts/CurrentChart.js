import React from 'react';
import GenericChart from '../GenericChart';
import useFetchMeterData from '../../hooks/useFetchMeterData';
import { useRecoilValue } from 'recoil';
import { shouldFetchDataState } from '../../lib/atoms';

const CurrentChart = ({ selectedMeter, chartType }) => {
  const shouldFetchData = useRecoilValue(shouldFetchDataState);
  const { data, loading, error } = useFetchMeterData(selectedMeter, shouldFetchData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  // Extract threshold values for current
  const { thresholdValues } = data;
  const currentThresholds = thresholdValues.current;

  const chartData = {
    labels: data.mappedData.time,
    datasets: [
      {
        label: 'Current I1',
        data: data.mappedData.current.I1,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Current I2',
        data: data.mappedData.current.I2,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Current I3',
        data: data.mappedData.current.I3,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'I1 Threshold',
        data: new Array(data.mappedData.time.length).fill(currentThresholds.IR1),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'I2 Threshold',
        data: new Array(data.mappedData.time.length).fill(currentThresholds.IR2),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'I3 Threshold',
        data: new Array(data.mappedData.time.length).fill(currentThresholds.IR3),
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
        text: 'Current Measurements',
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
          text: 'Current (A)',
        },
      },
    },
  };

  return <GenericChart chartType={chartType} data={chartData} options={options} />;
};

export default CurrentChart;