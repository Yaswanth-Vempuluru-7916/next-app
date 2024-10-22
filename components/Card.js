import React from "react";
import { Maximize2 } from "lucide-react";
import ChartTypeSelector from "./ChartTypeSelector";

const Card = ({ title, onFullScreen, onChangeChartType, chartType, children }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg relative p-4 h-64 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800 text-base truncate">{title}</h3>
        <div className="flex items-center space-x-2">
          <ChartTypeSelector chartType={chartType} onChangeChartType={onChangeChartType} />
          <button
            onClick={onFullScreen}
            className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-300"
            aria-label="Full Screen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
      
      {/* Content Area: Ensure it flexes and adapts within the card */}
      <div className="flex-grow flex items-center justify-center overflow-hidden">
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
