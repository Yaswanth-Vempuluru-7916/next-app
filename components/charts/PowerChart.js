// components/charts/PowerChart.js
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

  const chartData = {
    labels: data.time,
    datasets: [
      {
        label: 'Power P1',
        data: data.power.KW.p1,
        borderColor: 'rgba(128, 0, 128, 1)',
        backgroundColor: 'rgba(128, 0, 128, 0.3)',
        fill: chartType === 'area',
      },
      {
        label: 'Power P2',
        data: data.power.KW.p2,
        borderColor: 'rgba(0, 128, 128, 1)',
        backgroundColor: 'rgba(0, 128, 128, 0.3)',
        fill: chartType === 'area',
      },
      {
        label: 'Power P3',
        data: data.power.KW.p3,
        borderColor: 'rgba(255, 69, 0, 1)',
        backgroundColor: 'rgba(255, 69, 0, 0.3)',
        fill: chartType === 'area',
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
        text: `Power`,
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
