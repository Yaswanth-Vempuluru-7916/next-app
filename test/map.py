from datetime import datetime


def map_data_to_array_format(transformed_data):
    mapped_records = []

    for record in transformed_data:
        properties = record.get("energyMeterdata", {})
        timestamp_str = properties.get("timeStamp")

        # Parse the timestamp to separate date and time
        if timestamp_str:
            timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
            date_str = timestamp.date().isoformat()  # Get the date in YYYY-MM-DD format
            time_str = timestamp.time().isoformat()  # Get the time in HH:MM:SS format
        else:
            date_str = None
            time_str = None

        # Map voltage to array format
        voltage_array = [
            properties.get("voltage", {}).get("V1"),
            properties.get("voltage", {}).get("V2"),
            properties.get("voltage", {}).get("V3")
        ]

        # Map current to array format
        current_array = [
            properties.get("current", {}).get("I1"),
            properties.get("current", {}).get("I2"),
            properties.get("current", {}).get("I3")
        ]

        # Map power to array format
        power_kw_array = [
            properties.get("power", {}).get("KW", {}).get("L1"),
            properties.get("power", {}).get("KW", {}).get("L2"),
            properties.get("power", {}).get("KW", {}).get("L3")
        ]

        power_kvar_array = [
            properties.get("power", {}).get("Kvar", {}).get("L1"),
            properties.get("power", {}).get("Kvar", {}).get("L2"),
            properties.get("power", {}).get("Kvar", {}).get("L3")
        ]

        power_kva_array = [
            properties.get("power", {}).get("KVA", {}).get("L1"),
            properties.get("power", {}).get("KVA", {}).get("L2"),
            properties.get("power", {}).get("KVA", {}).get("L3")
        ]

        # Prepare the mapped record
        mapped_record = {
            "deviceID": properties.get("deviceID"),
            "date": date_str,  # Add the date
            "time": time_str,  # Add the time
            "voltage": voltage_array,
            "current": current_array,
            "power": {
                "KW": power_kw_array,
                "Kvar": power_kvar_array,
                "KVA": power_kva_array,
                "Total": {
                    "Kvar": properties.get("power", {}).get("Total", {}).get("Kvar"),
                    "KVA": properties.get("power", {}).get("Total", {}).get("KVA"),
                    "PF": properties.get("power", {}).get("Total", {}).get("PF"),
                    "KW": properties.get("power", {}).get("Total", {}).get("KW"),
                }
            }
        }

        mapped_records.append(mapped_record)

    return mapped_records
