'use client'
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import DateRangeDropdown from './DateRangeDropdown';
import EnergyMeterSidebar from './EnergyMeterSidebar';
import GraphLayout from './GraphLayout';
import DeviceInfo from './DeviceInfo';
import { useEnergyMeterStates } from '../hooks/useEnergyMeterStates';
import { shouldFetchDataState } from '../lib/atoms';

const DashboardContent = () => {
  const { fullScreenCard, selectedMeter } = useEnergyMeterStates();
  const setShouldFetchData = useSetRecoilState(shouldFetchDataState);

  const meterNames = {
    'WR2001000008': 'ENERGY-METER-01',
    'WR2009000663': 'ENERGY-METER-02',
    'WR2109000129': 'ENERGY-METER-03',
    'WR2109000128': 'ENERGY-METER-04',
    'WR2109000127': 'ENERGY-METER-06',
  };
  const selectedMeterName = meterNames[selectedMeter] || 'No Meter Selected';

  useEffect(() => {
    setShouldFetchData(true);
  }, [setShouldFetchData]);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen h-[100vh] overflow-hidden 
    bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnimatePresence>
        {fullScreenCard === null && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/4 lg:w-1/5 xl:w-1/6 h-full border-r border-gray-200 bg-white shadow-lg overflow-y-auto"
          >
            <EnergyMeterSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex flex-col w-full ${fullScreenCard === null ? 'md:w-3/4 lg:w-4/5 xl:w-5/6' : ''} h-full p-4 overflow-hidden`}>
        <AnimatePresence>
          {fullScreenCard === null && (
            <motion.div 
              className="flex justify-between items-center mb-4 bg-white z-10 pb-4 rounded-lg shadow-md p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-lg font-bold text-rose-500 mr-4">{selectedMeterName}</div>
              <div className="flex items-center space-x-4">
                <DateRangeDropdown />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {fullScreenCard === null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <DeviceInfo />
                        
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex-grow overflow-y-auto" // Only scroll within the graph area if necessary
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GraphLayout />
         
        </motion.div>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <RecoilRoot>
    <DashboardContent />
  </RecoilRoot>
);

export default Dashboard;
