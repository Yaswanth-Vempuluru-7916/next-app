// // hooks/useFetchDeviceInfo.js
// import { useState, useEffect } from 'react';

// const useFetchDeviceInfo = (selectedMeter) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:5000/api/device_info/${selectedMeter}`);
//         console.log('Response Status:', response.status); // Log the response status
//         if (!response.ok) {
//           const errorMessage = `HTTP error! status: ${response.status}`;
//           throw new Error(errorMessage);
//         }
//         const result = await response.json(); // Parse the JSON
//         console.log('Result:', result); // Log the result
//         setData(result.device_info);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedMeter) {
//       fetchData();
//     }
//   }, [selectedMeter]);

//   return { data, loading, error };
// };


// export default useFetchDeviceInfo;