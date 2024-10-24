// components/DateRangeDropdown.js
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { dateRangeState, shouldFetchDataState } from '../lib/atoms';

const DateRangeDropdown = () => {
  const [dateRange, setDateRange] = useRecoilState(dateRangeState);
  const setShouldFetchData = useSetRecoilState(shouldFetchDataState);

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const minTimestamp = oneYearAgo.getTime();
  const maxTimestamp = today.getTime();

  const [startDate, setStartDate] = useState(oneYearAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleChange = (e) => {
    const range = e.target.value;
    const now = new Date();
    let start = null;
    let end = formatDate(now);

    switch (range) {
      case 'Last Hour':
        start = formatDate(new Date(now.getTime() - 60 * 60 * 1000));
        break;

      case 'Yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        start = formatDate(yesterday);
        end = formatDate(yesterday);
        break;

      case 'Last Week':
        const lastWeekStart = new Date(now);
        const lastWeekEnd = new Date(now);
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        start = formatDate(lastWeekStart);
        end = formatDate(lastWeekEnd);
        break;

      case 'This Week':
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - now.getDay());
        start = formatDate(thisWeekStart);
        end = formatDate(now);
        break;

      case 'Last Month':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        start = formatDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1));
        end = formatDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0));
        break;

      case 'This Month':
        start = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
        end = formatDate(now);
        break;

      case 'Custom Dates':
        // Reset startDate and endDate to today when "Custom Dates" is selected
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        start = today.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;

      default:
        break;
    }

    setDateRange({ type: range, startDate: start, endDate: end });
    console.log(`Selected Option: ${range}, Start Date: ${start}, End Date: ${end}`);
  };

  const handleSliderChange = (event) => {
    const selectedDate = new Date(parseInt(event.target.value));
    const formattedDate = formatDate(selectedDate);
    
    if (event.target.name === 'startDate') {
      // Check if the new startDate exceeds the current endDate
      if (new Date(formattedDate) <= new Date(endDate)) {
        setStartDate(formattedDate);
      }
    } else {
      // Check if the new endDate is before the current startDate
      if (new Date(formattedDate) >= new Date(startDate)) {
        setEndDate(formattedDate);
      }
    }
  };

  const handleSubmit = () => {
    // Only fetch data if the custom dates have been changed from their default values
    if (startDate !== today.toISOString().split('T')[0] || endDate !== today.toISOString().split('T')[0]) {
      setDateRange({ type: 'Custom Dates', startDate, endDate });
      setShouldFetchData(true);
      console.log(`Final Submitted Start Date: ${startDate}, End Date: ${endDate}`);
    } else {
      console.log('No changes made to dates, skipping API call.');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <select
        className="border border-gray-300 rounded-md p-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={dateRange.type}
        onChange={handleChange}
      >
        <option value="">Select Date Range</option>
        <option value="Last Hour">Last Hour</option>
        <option value="Yesterday">Yesterday</option>
        <option value="Last Week">Last Week</option>
        <option value="This Week">This Week</option>
        <option value="Last Month">Last Month</option>
        <option value="This Month">This Month</option>
        <option value="Custom Dates">Custom Dates</option>
      </select>

      {dateRange.type === 'Custom Dates' && (
        <div className="flex space-x-4">
          <div className="flex flex-col items-start space-y-2">
            <label className="text-sm">Start Date: {startDate}</label>
            <input
              type="range"
              name="startDate"
              min={minTimestamp}
              max={maxTimestamp}
              step={86400000} // One day in milliseconds
              value={new Date(startDate).getTime()}
              onChange={handleSliderChange}
              className="slider appearance-none w-full h-2 rounded-lg bg-gray-300 outline-none transition duration-150 ease-in-out"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((new Date(startDate).getTime() - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%, #e5e7eb ${((new Date(startDate).getTime() - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>

          <div className="flex flex-col items-start space-y-2">
            <label className="text-sm">End Date: {endDate}</label>
            <input
              type="range"
              name="endDate"
              min={minTimestamp}
              max={maxTimestamp}
              step={86400000} // One day in milliseconds
              value={new Date(endDate).getTime()}
              onChange={handleSliderChange}
              className="slider appearance-none w-full h-2 rounded-lg bg-gray-300 outline-none transition duration-150 ease-in-out"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((new Date(endDate).getTime() - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%, #e5e7eb ${((new Date(endDate).getTime() - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-md py-2 px-6 hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown;
