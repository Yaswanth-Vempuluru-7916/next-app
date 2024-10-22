// components/DateRangeDropdown.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeDropdown = () => {
  const [selectedRange, setSelectedRange] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Helper function to format date with timezone info
  const formatDateWithTimezone = (date) => {
    return new Date(date).toISOString();
  };

  useEffect(() => {
    if (selectedRange === 'Custom Dates' && startDate && endDate) {
      const formattedStart = formatDateWithTimezone(startDate);
      const formattedEnd = formatDateWithTimezone(endDate);
      console.log(`Custom Dates: From ${formattedStart} to ${formattedEnd}`);
    }
  }, [startDate, endDate]);

  const handleChange = (e) => {
    const range = e.target.value;
    setSelectedRange(range);
    const now = new Date();

    let formattedStart = null;
    let formattedEnd = formatDateWithTimezone(now);

    switch (range) {
      case 'Last Hour':
        const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
        formattedStart = formatDateWithTimezone(lastHour);
        console.log(`Last Hour: From ${formattedStart} to ${formattedEnd}`);
        break;

      case 'Yesterday':
        const yesterdayStart = new Date(now.setDate(now.getDate() - 1));
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date();
        yesterdayEnd.setHours(23, 59, 59, 999);
        formattedStart = formatDateWithTimezone(yesterdayStart);
        formattedEnd = formatDateWithTimezone(yesterdayEnd);
        console.log(`Yesterday: From ${formattedStart} to ${formattedEnd}`);
        break;

      case 'Last Week':
        const lastMonday = new Date(now.setDate(now.getDate() - now.getDay() - 6)); // Last Monday
        lastMonday.setHours(0, 0, 0, 0);
        const lastSunday = new Date(now.setDate(now.getDate() - now.getDay())); // Last Sunday
        lastSunday.setHours(23, 59, 59, 999);
        formattedStart = formatDateWithTimezone(lastMonday);
        formattedEnd = formatDateWithTimezone(lastSunday);
        console.log(`Last Week: From ${formattedStart} to ${formattedEnd}`);
        break;

      case 'This Week':
        const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the current week
        thisWeekStart.setHours(0, 0, 0, 0);
        formattedStart = formatDateWithTimezone(thisWeekStart);
        console.log(`This Week: From ${formattedStart} to ${formattedEnd}`);
        break;

      case 'Last Month':
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month
        lastDayLastMonth.setHours(23, 59, 59, 999);
        formattedStart = formatDateWithTimezone(firstDayLastMonth);
        formattedEnd = formatDateWithTimezone(lastDayLastMonth);
        console.log(`Last Month: From ${formattedStart} to ${formattedEnd}`);
        break;

      case 'This Month':
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
        formattedStart = formatDateWithTimezone(thisMonthStart);
        console.log(`This Month: From ${formattedStart} to ${formattedEnd}`);
        break;

      case 'Custom Dates':
        // Custom dates will be handled by useEffect when dates are selected
        return;

      default:
        console.log('Select a valid range');
        return;
    }
  };

  const isCustomDateSelected = selectedRange === 'Custom Dates';

  return (
    <div className="flex flex-col space-y-4">
      <select
        className="border border-gray-300 rounded-md p-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selectedRange}
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

      {isCustomDateSelected && (
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            maxDate={new Date()} // Block future dates
            placeholderText="Start Date"
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            maxDate={new Date()} // Block future dates
            placeholderText="End Date"
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown;
