import React from 'react'; 
import { motion } from 'framer-motion';
import { useEnergyMeterStates } from '../hooks/useEnergyMeterStates';

const EnergyMeterSidebar = () => {
  const { selectedMeter, setSelectedMeter } = useEnergyMeterStates();
  const energyMeters = [
    { id: 'WR2001000008', name: 'Energy Meter 1' },
    { id: 'WR2009000663', name: 'Energy Meter 2' },
    { id: 'WR2109000129', name: 'Energy Meter 3' },
    { id: 'WR2109000128', name: 'Energy Meter 4' },
    { id: 'WR2109000127', name: 'Energy Meter 6' },
  ];

  return (
    <div className="bg-white h-full flex flex-col"> {/* Ensure full height */}
      <h2 className="font-bold mb-6 text-gray-800 text-2xl px-6 py-4 border-b border-gray-200">
        Energy Meters
      </h2>
      <ul className="flex-grow overflow-y-auto px-4"> {/* Flex-grow to take remaining space and allow scrolling */}
        {energyMeters.map((meter) => (
          <motion.li
            key={meter.id}
            className={`py-4 px-6 cursor-pointer rounded-lg transition-colors duration-300 ${
              selectedMeter === meter.id
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedMeter(meter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {meter.name}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default EnergyMeterSidebar;
