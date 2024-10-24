import datetime

def transform_data(extracted_data):
    transformed_records = []
    for record in extracted_data:
        properties = record.get("property", {})

        # Extracting and transforming the timestamp
        timestamp = record.get("created_at")
        if timestamp:
            dt = datetime.datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            date = dt.date().isoformat()  # YYYY-MM-DD format
            time = dt.strftime("%H:%M:%S")  # HH:MM:SS format without milliseconds
        else:
            date = None
            time = None

        transformed_record = {
            "date": date,
            "time": time,
            "timestamp": timestamp,
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
                    "L3": properties.get("PF_L1")
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
                },
                "Frequency": properties.get("Frequency")
            }
        }

        transformed_records.append(transformed_record)

    return transformed_records