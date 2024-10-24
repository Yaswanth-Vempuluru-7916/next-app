import React from 'react';
import GenericChart from '../GenericChart';
import useFetchMeterData from '../../hooks/useFetchMeterData';
import { useRecoilValue } from 'recoil';
import { shouldFetchDataState } from '../../lib/atoms';

const PowerChart = ({ selectedMeter, chartType }) => {
  const shouldFetchData = useRecoilValue(shouldFetchDataState);
  const { data, loading, error } = useFetchMeterData(selectedMeter, shouldFetchData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  // Extract threshold values for power
  const { thresholdValues } = data;
  const powerThresholds = thresholdValues.power;

  const chartData = {
    labels: data.mappedData.time,
    datasets: [
      {
        label: 'Power L1',
        data: data.mappedData.power.KW.L1,
        borderColor: 'rgba(128, 0, 128, 1)',
        backgroundColor: 'rgba(128, 0, 128, 0.3)',
        fill: chartType === 'area',
      },
      {
        label: 'Power L2',
        data: data.mappedData.power.KW.L2,
        borderColor: 'rgba(0, 128, 128, 1)',
        backgroundColor: 'rgba(0, 128, 128, 0.3)',
        fill: chartType === 'area',
      },
      {
        label: 'Power L3',
        data: data.mappedData.power.KW.L3,
        borderColor: 'rgba(255, 69, 0, 1)',
        backgroundColor: 'rgba(255, 69, 0, 0.3)',
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
        text: 'Power',
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

export default PowerChart;