// components/DeviceInfo.js
import React from 'react';
import { motion } from 'framer-motion';
import { useEnergyMeterStates } from '../hooks/useEnergyMeterStates';
import useFetchMeterData from '@/hooks/useFetchMeterData';

const DeviceInfo = () => {
  const { selectedMeter } = useEnergyMeterStates();
  const { data: deviceData, loading, error } = useFetchMeterData(selectedMeter, '2024-10-21', 5); // Example values for targetDate and maxPages

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">Error: {error}</div>;
  if (!deviceData) return <div className="text-center">No device selected.</div>;

  // Displaying device information from fetched data
  const infoItems = [
    { label: 'Device ID', value: deviceData.deviceInfo.deviceID },
    // { label: 'Device Name', value: deviceData.deviceInfo.deviceName },
    // { label: 'Model Name', value: deviceData.deviceInfo.modelName },
    { label: 'MAC Address', value: deviceData.deviceInfo.macAddress },
    { label: 'Version', value: deviceData.deviceInfo.version },
    // { label: 'IP Address', value: deviceData.deviceInfo.IPADD },
    { label: 'Status', value: deviceData.deviceInfo.status, className: deviceData.deviceInfo.status === 'normal' ? 'text-green-600' : 'text-red-600' },
    // { label: 'Source Site Name', value: deviceData.deviceInfo.sourceSitename },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-xl rounded-lg p-4"
    >
      <div className="grid grid-cols-4 gap-2 text-sm">
        {infoItems.map((item, index) => (
          <div key={index}>
            <div className="font-semibold text-gray-700">{item.label}</div>
            <div className={`text-gray-800 ${item.className || ''}`}>{item.value || 'N/A'}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DeviceInfo;


