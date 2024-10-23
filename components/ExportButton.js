// components/ExportButton.js
import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExportButton = ({ data }) => {
  const handleExport = () => {
    if (!data) return;

    // Convert data to worksheet format
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Energy Data');
    
    // Generate file name with current date
    const fileName = `energy_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
    >
      <Download size={20} />
      <span>Export Data</span>
    </button>
  );
};

export default ExportButton;