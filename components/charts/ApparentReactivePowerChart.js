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

  // Extract threshold values for power
  const { thresholdValues } = data;
  const powerThresholds = thresholdValues.power;

  const chartData = {
    labels: data.mappedData.time,
    datasets: [
      // Apparent Power (KVA)
      {
        label: 'KVA L1',
        data: data.mappedData.power.KVA.L1,
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVA L2',
        data: data.mappedData.power.KVA.L2,
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'KVA L3',
        data: data.mappedData.power.KVA.L3,
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.5)',
        fill: chartType === 'area',
      },
      // Reactive Power (KVAR)
      {
        label: 'Kvar L1',
        data: data.mappedData.power.Kvar.L1,
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Kvar L2',
        data: data.mappedData.power.Kvar.L2,
        borderColor: 'rgba(23, 162, 184, 1)',
        backgroundColor: 'rgba(23, 162, 184, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Kvar L3',
        data: data.mappedData.power.Kvar.L3,
        borderColor: 'rgba(108, 117, 125, 1)',
        backgroundColor: 'rgba(108, 117, 125, 0.5)',
        fill: chartType === 'area',
      },
      // Thresholds
      {
        label: 'KVA Threshold',
        data: new Array(data.mappedData.time.length).fill(powerThresholds.KVA),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Kvar Threshold',
        data: new Array(data.mappedData.time.length).fill(powerThresholds.Kvar),
        borderColor: 'rgba(0, 0, 255, 0.5)',
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
          text: 'Power (KVA/Kvar)',
        },
      },
    },
  };

  return <GenericChart chartType={chartType} data={chartData} options={options} />;
};

export default ApparentReactivePowerChart;