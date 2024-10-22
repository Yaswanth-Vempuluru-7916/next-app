// hooks/useFetchMeterData.js
import { useState, useEffect } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { shouldFetchDataState } from '../lib/atoms';

const useFetchMeterData = (selectedMeter, targetDate, maxPages) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const shouldFetchData = useRecoilValue(shouldFetchDataState);
  const resetShouldFetchData = useResetRecoilState(shouldFetchDataState);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Log when the API call is about to be made
        console.log('Fetching data from API with parameters:', {
          selectedMeter,
          targetDate,
          maxPages,
        });

        const response = await fetch(`http://127.0.0.1:8000/fetch-and-transform?device_serial_number=${selectedMeter}&target_date=2024-10-21&max_pages=5`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        
        // Log the fetched data
        // console.log('Fetched Data:', result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        resetShouldFetchData();
      }
    };

    if (selectedMeter && targetDate && (shouldFetchData || data === null)) {
      fetchData();
    }
  }, [selectedMeter, targetDate, maxPages, shouldFetchData, resetShouldFetchData]);

  return { data, loading, error };
};

export default useFetchMeterData;
