// // hooks/useFetchEnergyData.js
// import { useState, useEffect } from 'react';
// import { useRecoilValue, useResetRecoilState } from 'recoil';
// import { shouldFetchDataState } from '../lib/atoms';

// const useFetchEnergyData = (selectedMeter, dataType) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const shouldFetchData = useRecoilValue(shouldFetchDataState);
//   const resetShouldFetchData = useResetRecoilState(shouldFetchDataState);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Get current date in YYYY-MM-DD format
//         const today = new Date().toISOString().split('T')[0];
        
//         const response = await fetch(
//           // `http://127.0.0.1:8000/fetch-and-transform?device_serial_number=${selectedMeter}&target_date=${today}&max_pages=50`
//           `http://127.0.0.1:8000/fetch-and-transform?device_serial_number=WR2009000663&target_date=2024-10-20&max_pages=15`
//         );
        
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
        
//         const result = await response.json();
        
//         // Transform the data based on dataType
//         const transformedData = transformData(result.mapped_data, dataType);
//         setData(transformedData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//         resetShouldFetchData();
//       }
//     };

//     if (selectedMeter && dataType && (shouldFetchData || data === null)) {
//       fetchData();
//     }
//   }, [selectedMeter, dataType, shouldFetchData, resetShouldFetchData]);

//   return { data, loading, error };
// };

// // Helper function to transform the data based on type
// const transformData = (rawData, dataType) => {
//   if (!rawData || !rawData.length) return null;

//   const timeLabels = rawData.map(entry => `${entry.date} ${entry.time.split('.')[0]}`);

//   switch (dataType) {
//     case 'current':
//       return {
//         time: timeLabels,
//         current1: rawData.map(entry => entry.current[0]),
//         current2: rawData.map(entry => entry.current[1]),
//         current3: rawData.map(entry => entry.current[2])
//       };

//     case 'voltage':
//       return {
//         time: timeLabels,
//         voltage1: rawData.map(entry => entry.voltage[0]),
//         voltage2: rawData.map(entry => entry.voltage[1]),
//         voltage3: rawData.map(entry => entry.voltage[2])
//       };

//     case 'power':
//       return {
//         time: timeLabels,
//         kw1: rawData.map(entry => entry.power.KW[0]),
//         kw2: rawData.map(entry => entry.power.KW[1]),
//         kw3: rawData.map(entry => entry.power.KW[2])
//       };

//     case 'apparent_vs_reactive_power':
//       return {
//         time: timeLabels,
//         kva: rawData.map(entry => entry.power.Total.KVA),
//         kvar: rawData.map(entry => entry.power.Total.Kvar)
//       };

//     case 'total_power':
//       return {
//         time: timeLabels,
//         totalKW: rawData.map(entry => entry.power.Total.KW),
//         powerFactor: rawData.map(entry => entry.power.Total.PF)
//       };

//     default:
//       return null;
//   }
// };

// export default useFetchEnergyData;