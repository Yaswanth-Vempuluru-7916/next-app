// hooks/useFetchMeterData.js
import { useState, useEffect } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { shouldFetchDataState, dateRangeState } from '../lib/atoms';

const useFetchMeterData = (selectedMeter) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const shouldFetchData = useRecoilValue(shouldFetchDataState);
  const dateRange = useRecoilValue(dateRangeState);
  const resetShouldFetchData = useResetRecoilState(shouldFetchDataState);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.endDate) return;
      
      setLoading(true);
      try {
        const url = `http://127.0.0.1:8000/fetch-and-transform?device_serial_number=${selectedMeter}&target_date=${dateRange.endDate}&max_pages=5`;
        console.log(`Start  date : ${dateRange.startDate} && End  date : ${dateRange.endDate}`);
        console.log('Fetching data from API:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        resetShouldFetchData();
      }
    };

    if (selectedMeter && (shouldFetchData || data === null)) {
      fetchData();
    }
  }, [selectedMeter, dateRange, shouldFetchData, resetShouldFetchData]);

  return { data, loading, error };
};

export default useFetchMeterData;