# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from extract import fetch_data 
# from transform import transform_data  
# from calibration import load_scaling_factors, scale_values  
# from map import map_data_to_array_format  

# app = FastAPI()

# # Define allowed origins, or you can set it to "*" for any domain.
# origins = [
#     "http://localhost:3000",  # Your Next.js app
# ]

# # Add CORS middleware to allow specific origins
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Allows requests from these origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )

# scaling_factors = load_scaling_factors('calibration.json')

# @app.get("/fetch-and-transform")
# async def fetch_and_transform(device_serial_number: str, target_date: str, max_pages: int = 50):
#     try:
#         extracted_data = await fetch_data(device_serial_number, target_date, max_pages)
       
#         for record in extracted_data['data']:
#             properties = record.get("property", {})
#             scaled_properties = scale_values(device_serial_number, properties, scaling_factors)
#             record['property'] = scaled_properties  

#         transformed_data = transform_data(extracted_data['data'])
#         mapped_data = map_data_to_array_format(transformed_data)
        
#         return {"status": "success", "mapped_data": mapped_data}

#     except Exception as e:
#         print(f"Internal Server Error: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from extract import fetch_data 
from transform import transform_data  
from calibration import load_scaling_factors, scale_values  
from map import map_data_to_array_format  

app = FastAPI()

# Define allowed origins, or you can set it to "*" for any domain.
origins = [
    "http://localhost:3000",  # Your Next.js app
]

# Add CORS middleware to allow specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

scaling_factors = load_scaling_factors('calibration.json')

@app.get("/fetch-and-transform")
async def fetch_and_transform(device_serial_number: str, target_date: str, max_pages: int = 50):
    try:
        extracted_data = await fetch_data(device_serial_number, target_date, max_pages)

        # Scale and process properties
        for record in extracted_data['data']:
            properties = record.get("property", {})
            scaled_properties = scale_values(device_serial_number, properties, scaling_factors)
            record['property'] = scaled_properties  

        # Transform and map data
        transformed_data = transform_data(extracted_data['data'])
        mapped_data = map_data_to_array_format(transformed_data)

        # Initialize the structure for the response
        response_structure = {
            "deviceID": device_serial_number,  # Set from request if not present in data
            "macAddress": "",
            "version": "",
            "status": "",
            "date": [],
            "time": [],
            "voltage": {
                "v1": [],
                "v2": [],
                "v3": []
            },
            "current": {
                "c1": [],
                "c2": [],
                "c3": []
            },
            "power": {
                "KW": {
                    "p1": [],
                    "p2": [],
                    "p3": []
                },
                "Kvar": {
                    "p1": [],
                    "p2": [],
                    "p3": []
                },
                "KVA": {
                    "p1": [],
                    "p2": [],
                    "p3": []
                },
                "Total": {
                    "KW": 0,
                    "Kvar": 0,
                    "KVA": 0,
                    "PF": 0
                }
            }
        }

        # Process the mapped_data and fill in the respective fields
        for record in mapped_data:
            # Set device information
            if "deviceID" in record:
                response_structure["deviceID"] = record["deviceID"]
            if "macAddress" in record:
                response_structure["macAddress"] = record["macAddress"]
            if "version" in record:
                response_structure["version"] = record["version"]
            if "status" in record:
                response_structure["status"] = record["status"]

            # Append date and time
            if "date" in record:
                response_structure["date"].append(record["date"])
            if "time" in record:
                response_structure["time"].append(record["time"])

            # Append voltage data
            if "voltage" in record:
                response_structure["voltage"]["v1"].append(record["voltage"][0])
                response_structure["voltage"]["v2"].append(record["voltage"][1])
                response_structure["voltage"]["v3"].append(record["voltage"][2])

            # Append current data
            if "current" in record:
                response_structure["current"]["c1"].append(record["current"][0])
                response_structure["current"]["c2"].append(record["current"][1])
                response_structure["current"]["c3"].append(record["current"][2])

            # Append power data (KW, Kvar, KVA)
            if "power" in record:
                if "KW" in record["power"]:
                    response_structure["power"]["KW"]["p1"].append(record["power"]["KW"][0])
                    response_structure["power"]["KW"]["p2"].append(record["power"]["KW"][1])
                    response_structure["power"]["KW"]["p3"].append(record["power"]["KW"][2])
                if "Kvar" in record["power"]:
                    response_structure["power"]["Kvar"]["p1"].append(record["power"]["Kvar"][0])
                    response_structure["power"]["Kvar"]["p2"].append(record["power"]["Kvar"][1])
                    response_structure["power"]["Kvar"]["p3"].append(record["power"]["Kvar"][2])
                if "KVA" in record["power"]:
                    response_structure["power"]["KVA"]["p1"].append(record["power"]["KVA"][0])
                    response_structure["power"]["KVA"]["p2"].append(record["power"]["KVA"][1])
                    response_structure["power"]["KVA"]["p3"].append(record["power"]["KVA"][2])
                
                # Update total power values (KW, Kvar, KVA, PF)
                if "Total" in record["power"]:
                    total_power = record["power"]["Total"]
                    response_structure["power"]["Total"]["KW"] = total_power.get("KW", 0)
                    response_structure["power"]["Total"]["Kvar"] = total_power.get("Kvar", 0)
                    response_structure["power"]["Total"]["KVA"] = total_power.get("KVA", 0)
                    response_structure["power"]["Total"]["PF"] = total_power.get("PF", 0)

        # Return the formatted data in the new structure
        return  response_structure

    except Exception as e:
        print(f"Internal Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
