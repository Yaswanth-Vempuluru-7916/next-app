def transform_data(extracted_data):
    transformed_records = []
    for record in extracted_data:
       
        properties = record.get("property", {})
        transformed_record = {
            "energyMeterdata": {
                "DVer": "Version 1.0",
                "PVer": "Version 1.0",
                "deviceID": record.get("serialNumber"),
                "deviceCategory": "Energy Meter",
                "sourceSitename": "Energy Site",
                "timeStamp": record.get("created_at"),
                "modelName": properties.get("modelname"),
                "deviceName": properties.get("devicename"),
                "version": properties.get("version"),
                "macAddress": properties.get("mac address"),
                "serialNumber": properties.get("serial number"),
                "IPADD": properties.get("IPADD"),
                "status": properties.get("status"),
                "voltage": {
                    "V1": properties.get("V1_Voltage"),
                    "V2": properties.get("V2_Voltage"),
                    "V3": properties.get("V3_Voltage")
                },
                "current": {
                    "I1": properties.get("I1_Current"),
                    "I2": properties.get("I2_Current"),
                    "I3": properties.get("I3_Current")
                },
                "power": {
                    "KW": {
                        "L1": properties.get("KW_L1"),
                        "L2": properties.get("KW_L2"),
                        "L3": properties.get("KW_L3")
                    },
                    "Kvar": {
                        "L1": properties.get("Kvar_L1"),
                        "L2": properties.get("Kvar_L2"),
                        "L3": properties.get("Kvar_L3")
                    },
                    "KVA": {
                        "L1": properties.get("KVA_L1"),
                        "L2": properties.get("KVA_L2"),
                        "L3": properties.get("KVA_L3")
                    },
                    "PF": {
                        "L1": properties.get("PF_L1"),
                        "L2": properties.get("PF_L2"),
                        "L3": properties.get("PF_L3")
                    },
                    "Total": {
                        "Kvar": properties.get("Total_Kvar"),
                        "KVA": properties.get("Total_KVA"),
                        "PF": properties.get("Total_PF"),
                        "KW": (
                            properties.get("KW_L1", 0) +
                            properties.get("KW_L2", 0) +
                            properties.get("KW_L3", 0)
                        )
                    }
                },
                "energy": {
                    "KwhImport": properties.get("KWh_import"),
                    "KVAhImport": properties.get("KVAh_import")
                },
                "network": {
                    "act": properties.get("act"),
                    "rssi": properties.get("rssi"),
                    "wwanIp": properties.get("wwan_ip"),
                    "rsrp": properties.get("rsrp"),
                    "rsrq": properties.get("rsrq"),
                    "lte": {
                        "rx": properties.get("lte_rx"),
                        "tx": properties.get("lte_tx"),
                        "bytes": properties.get("lte_bytes")
                    }
                }
            }
        }
        transformed_records.append(transformed_record)

    return transformed_records
