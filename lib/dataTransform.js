// lib/dataTransform.js

export const mapDataToGraphStructure = (response) => {
    const structuredData = {
      deviceInfo: {
        DVer: response.device_info.DVer,
        PVer: response.device_info.PVer,
        deviceID: response.device_info.deviceID,
        deviceCategory: response.device_info.deviceCategory,
        sourceSitename: response.device_info.sourceSitename,
        modelName: response.device_info.modelName,
        deviceName: response.device_info.deviceName,
        version: response.device_info.version,
        macAddress: response.device_info.macAddress,
        serialNumber: response.device_info.serialNumber,
        IPADD: response.device_info.IPADD,
        status: response.device_info.status,
      },
      thresholdValues: {
        voltage: {
          VL1: response.threshold_values.voltage.VL1,
          VL2: response.threshold_values.voltage.VL2,
          VL3: response.threshold_values.voltage.VL3,
        },
        current: {
          IR1: response.threshold_values.current.IR1,
          IR2: response.threshold_values.current.IR2,
          IR3: response.threshold_values.current.IR3,
        },
        power: {
          KW: response.threshold_values.power.KW,
          Kvar: response.threshold_values.power.Kvar,
          KVA: response.threshold_values.power.KVA,
          PF: response.threshold_values.power.PF,
        },
        Frequency: response.threshold_values.Frequency,
      },
      mappedData: {
        date: [],
        time: [],
        timestamps: [],
        voltage: {
          V1: [],
          V2: [],
          V3: [],
        },
        current: {
          I1: [],
          I2: [],
          I3: [],
        },
        power: {
          KW: { L1: [], L2: [], L3: [] },
          Kvar: { L1: [], L2: [], L3: [] },
          KVA: { L1: [], L2: [], L3: [] },
          PF: { L1: [], L2: [], L3: [] },
          Total: { KW: [], Kvar: [], KVA: [], PF: [] },
        },
        energy: {
          KwhImport: [],
          KVAhImport: [],
        },
        network: {
          act: [],
          rssi: [],
          rsrp: [],
          rsrq: [],
          Frequency: [],
        },
      },
    };
  
    // Iterate over each data point in the mapped_data array
    response.mapped_data.forEach((dataPoint) => {
      // Extract timestamp
      structuredData.mappedData.timestamps.push(dataPoint.timestamp);
      structuredData.mappedData.date.push(dataPoint.date);
      structuredData.mappedData.time.push(dataPoint.time);
  
      // Map voltage
      structuredData.mappedData.voltage.V1.push(dataPoint.voltage.V1);
      structuredData.mappedData.voltage.V2.push(dataPoint.voltage.V2);
      structuredData.mappedData.voltage.V3.push(dataPoint.voltage.V3);
  
      // Map current
      structuredData.mappedData.current.I1.push(dataPoint.current.I1);
      structuredData.mappedData.current.I2.push(dataPoint.current.I2);
      structuredData.mappedData.current.I3.push(dataPoint.current.I3);
  
      // Map power
      structuredData.mappedData.power.KW.L1.push(dataPoint.power.KW.L1);
      structuredData.mappedData.power.KW.L2.push(dataPoint.power.KW.L2);
      structuredData.mappedData.power.KW.L3.push(dataPoint.power.KW.L3);
  
      structuredData.mappedData.power.Kvar.L1.push(dataPoint.power.Kvar.L1);
      structuredData.mappedData.power.Kvar.L2.push(dataPoint.power.Kvar.L2);
      structuredData.mappedData.power.Kvar.L3.push(dataPoint.power.Kvar.L3);
  
      structuredData.mappedData.power.KVA.L1.push(dataPoint.power.KVA.L1);
      structuredData.mappedData.power.KVA.L2.push(dataPoint.power.KVA.L2);
      structuredData.mappedData.power.KVA.L3.push(dataPoint.power.KVA.L3);
  
      structuredData.mappedData.power.PF.L1.push(dataPoint.power.PF.L1);
      structuredData.mappedData.power.PF.L2.push(dataPoint.power.PF.L2);
      structuredData.mappedData.power.PF.L3.push(dataPoint.power.PF.L3);
  
      structuredData.mappedData.power.Total.KW.push(dataPoint.power.Total.KW);
      structuredData.mappedData.power.Total.Kvar.push(dataPoint.power.Total.Kvar);
      structuredData.mappedData.power.Total.KVA.push(dataPoint.power.Total.KVA);
      structuredData.mappedData.power.Total.PF.push(dataPoint.power.Total.PF);
  
      // Map energy
      structuredData.mappedData.energy.KwhImport.push(dataPoint.energy.KwhImport);
      structuredData.mappedData.energy.KVAhImport.push(dataPoint.energy.KVAhImport);
  
      // Map network data
      structuredData.mappedData.network.act.push(dataPoint.network.act);
      structuredData.mappedData.network.rssi.push(dataPoint.network.rssi);
      structuredData.mappedData.network.rsrp.push(dataPoint.network.rsrp);
      structuredData.mappedData.network.rsrq.push(dataPoint.network.rsrq);
      structuredData.mappedData.network.Frequency.push(dataPoint.network.Frequency);
    });
  
    // Reverse the mapped data arrays to be in chronological order
    structuredData.mappedData.date.reverse();
    structuredData.mappedData.time.reverse();
    structuredData.mappedData.timestamps.reverse();
    structuredData.mappedData.voltage.V1.reverse();
    structuredData.mappedData.voltage.V2.reverse();
    structuredData.mappedData.voltage.V3.reverse();
    structuredData.mappedData.current.I1.reverse();
    structuredData.mappedData.current.I2.reverse();
    structuredData.mappedData.current.I3.reverse();
    structuredData.mappedData.power.KW.L1.reverse();
    structuredData.mappedData.power.KW.L2.reverse();
    structuredData.mappedData.power.KW.L3.reverse();
    structuredData.mappedData.power.Kvar.L1.reverse();
    structuredData.mappedData.power.Kvar.L2.reverse();
    structuredData.mappedData.power.Kvar.L3.reverse();
    structuredData.mappedData.power.KVA.L1.reverse();
    structuredData.mappedData.power.KVA.L2.reverse();
    structuredData.mappedData.power.KVA.L3.reverse();
    structuredData.mappedData.power.PF.L1.reverse();
    structuredData.mappedData.power.PF.L2.reverse();
    structuredData.mappedData.power.PF.L3.reverse();
    structuredData.mappedData.power.Total.KW.reverse();
    structuredData.mappedData.power.Total.Kvar.reverse();
    structuredData.mappedData.power.Total.KVA.reverse();
    structuredData.mappedData.power.Total.PF.reverse();
    structuredData.mappedData.energy.KwhImport.reverse();
    structuredData.mappedData.energy.KVAhImport.reverse();
    structuredData.mappedData.network.act.reverse();
    structuredData.mappedData.network.rssi.reverse();
    structuredData.mappedData.network.rsrp.reverse();
    structuredData.mappedData.network.rsrq.reverse();
    structuredData.mappedData.network.Frequency.reverse();
  
    return structuredData;
  };
  