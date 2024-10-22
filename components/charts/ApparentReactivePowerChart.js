// components/charts/ApparentReactivePowerChart.js
import React from 'react';
import GenericChart from '../GenericChart';
import useFetchMeterData from '../../hooks/useFetchMeterData';
import { useRecoilValue } from 'recoil';
import { shouldFetchDataState } from '../../lib/atoms';

const ApparentReactivePowerChart = ({ selectedMeter, chartType }) => {
  const shouldFetchData = useRecoilValue(shouldFetchDataState);
  const { data, loading, error } = useFetchMeterData(selectedMeter, shouldFetchData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const chartData = {
    labels: data.time,
    datasets: [
      {
        label: 'KVA L1',
        data: data.apparent.KVA.L1,
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVA L2',
        data: data.apparent.KVA.L2,
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVA L3',
        data: data.apparent.KVA.L3,
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVAR L1',
        data: data.reactive.KVAR.L1,
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVAR L2',
        data: data.reactive.KVAR.L2,
        borderColor: 'rgba(23, 162, 184, 1)',
        backgroundColor: 'rgba(23, 162, 184, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVAR L3',
        data: data.reactive.KVAR.L3,
        borderColor: 'rgba(108, 117, 125, 1)',
        backgroundColor: 'rgba(108, 117, 125, 0.5)',
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
        text: 'Apparent vs Reactive Power',
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
          text: 'Power (KVA/KVAR)',
        },
      },
    },
  };

  return <GenericChart chartType={chartType} data={chartData} options={options} />;
};

export default ApparentReactivePowerChart;
