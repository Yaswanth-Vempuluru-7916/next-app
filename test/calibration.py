import json

def load_scaling_factors(filename: str):
    with open(filename, 'r') as file:
        return json.load(file)

def scale_values(device_serial: str, properties: dict, scaling_factors: dict):
    scaled_properties = {}

    for key, value in properties.items():
        if key in scaling_factors.get(device_serial, {}):
            scaling_factor = scaling_factors[device_serial][key]
            if scaling_factor != 0:
                scaled_properties[key] = value / scaling_factor
            else:
                scaled_properties[key] = 0
        else:
            scaled_properties[key] = value  # Keep original value if no scaling factor is found

    return scaled_properties
