import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { dateRangeState, shouldFetchDataState } from '../lib/atoms';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeDropdown = () => {
  const [dateRange, setDateRange] = useRecoilState(dateRangeState);
  const setShouldFetchData = useSetRecoilState(shouldFetchDataState);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const range = e.target.value;
    const now = new Date();
    let startDate = null;
    let endDate = formatDate(now);

    switch (range) {
      case 'Last Hour':
        startDate = formatDate(new Date(now.getTime() - 60 * 60 * 1000)); // Last hour
        break;

      case 'Yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = formatDate(yesterday);
        endDate = formatDate(yesterday); // Same for both start and end
        break;

      case 'Last Week':
        const lastWeekStart = new Date(now);
        const lastWeekEnd = new Date(now);
        
        // Move to the previous Sunday (or Saturday based on your locale)
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6); // Set to the following Saturday
        
        startDate = formatDate(lastWeekStart);
        endDate = formatDate(lastWeekEnd);
        break;

      case 'This Week':
        const thisWeekStart = new Date(now);
        const thisWeekEnd = new Date(now);
        
        // Move to the start of this week (Monday or Sunday)
        thisWeekStart.setDate(now.getDate() - now.getDay()); // Sunday
        // No need to change the end date, it stays as today (now)

        startDate = formatDate(thisWeekStart);
        endDate = formatDate(thisWeekEnd);
        break;

      case 'Last Month':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        startDate = formatDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1));
        endDate = formatDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0));
        break;

      case 'This Month':
        startDate = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
        break;

      case 'Custom Dates':
        // Keep existing dates if switching to custom
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
        break;

      default:
        break;
    }

    // Update Recoil state
    setDateRange({
      type: range,
      startDate,
      endDate,
    });

    // Trigger fetch
    setShouldFetchData(true);

    // Log the selected option for debugging
    console.log(`Selected Option: ${range}, Start Date: ${startDate}, End Date: ${endDate}`);
  };

  const handleCustomDateChange = (type, date) => {
    const formattedDate = date ? formatDate(date) : null;
    setDateRange(prev => ({
      ...prev,
      [type]: formattedDate
    }));
    setShouldFetchData(true);
  };

  return (
    <div className="flex items-center space-x-4">
      <select
        className="border border-gray-300 rounded-md p-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
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
          <DatePicker
            selected={dateRange.startDate ? new Date(dateRange.startDate) : null}
            onChange={(date) => handleCustomDateChange('startDate', date)}
            maxDate={new Date()}
            placeholderText="Start Date"
            className="border border-gray-300 rounded-md p-2"
          />
          <DatePicker
            selected={dateRange.endDate ? new Date(dateRange.endDate) : null}
            onChange={(date) => handleCustomDateChange('endDate', date)}
            maxDate={new Date()}
            placeholderText="End Date"
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown;
