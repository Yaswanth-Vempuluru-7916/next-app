import React from 'react';
import GenericChart from '../GenericChart';

const FrequencyChart = ({ chartType, data }) => {
  if (!data) return null;

  // Extract threshold values for frequency
  const { thresholdValues } = data;
  const frequencyThreshold = thresholdValues.Frequency;

  const chartData = {
    labels: data.mappedData.time,
    datasets: [
      {
        label: 'Frequency (Hz)',
        data: data.mappedData.network.Frequency,
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        fill: chartType === 'area',
      },
      {
        label: 'Frequency Threshold',
        data: new Array(data.mappedData.time.length).fill(frequencyThreshold),
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
        text: 'Frequency',
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
          text: 'Frequency (Hz)',
        },
      },
    },
  };

  return <GenericChart chartType={chartType} data={chartData} options={options} />;
};

export default FrequencyChart;
