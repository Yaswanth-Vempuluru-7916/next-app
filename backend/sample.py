from fastapi import FastAPI, HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal
import httpx
import uvicorn
from datetime import datetime, timedelta
from dateutil import parser

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The API URL to fetch raw data
api_url = 'https://device-services-maya.gentleplant-8ec40f17.centralindia.azurecontainerapps.io/api/device-service/v2/c09b7257-2c61-4854-8461-f9f8abeb6a68/device_management/fetch_chart_data'  # Update with your actual API URL
async def fetch_data(deviceSerialNumber: str, dataPerPage: int):
    request_data = {
        "deviceSerialNumber": deviceSerialNumber,
        "type": "modon",
        "data_per_page": dataPerPage
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, json=request_data)
            response.raise_for_status()
            data = response.json()
            return data['response']['Payload']
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e}")
        return None
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def filter_data_by_interval(data, interval):
    now = datetime.now()
    if interval == "last_hour":
        start_time = now - timedelta(hours=1)
        end_time = now
    elif interval == "yesterday":
        start_time = now - timedelta(days=1)
        end_time = now
    elif interval == "this_week":
        start_time = now - timedelta(days=now.weekday())
        end_time = now
    elif interval == "this_month":
        start_time = now.replace(day=1)
        end_time = now
    elif interval == "custom":
        # You'll need to implement the custom date logic here
        pass

    filtered_data = []
    for record in data:
        timestamp = datetime.strptime(record['created_at'], '%Y-%m-%dT%H:%M:%S.%f+00:00')
        if start_time <= timestamp <= end_time:
            filtered_data.append(record)

    return filtered_data

@app.get("/api/fetch_graph_data/{deviceSerialNumber}/{graph_type}/{interval}")
async def get_graph_data(
    deviceSerialNumber: str,
    graph_type: Literal[
        "voltage",
        "current",
        "power",
        "apparent_vs_reactive_power",
        "total_power",
        "frequency"
    ],
    interval: Literal[
        "last_hour",
        "yesterday",
        "this_week",
        "this_month",
        "custom"
    ],
    dataPerPage: int = 1000
):
    # Fetch raw data from the backend API
    raw_data = await fetch_data(deviceSerialNumber, dataPerPage)

    if not raw_data:
        raise HTTPException(status_code=500, detail="Failed to fetch data")

    # Filter data by interval
    filtered_data = filter_data_by_interval(raw_data, interval)

    # Filter valid records and transform the data based on graph type
    valid_data = [record for record in filtered_data if 'property' in record]
    transformed_data = transform_data(graph_type, valid_data)

    return transformed_data
# import httpx
# from fastapi import HTTPException
# import asyncio

# api_url = 'https://device-services-maya.gentleplant-8ec40f17.centralindia.azurecontainerapps.io/api/device-service/v2/c09b7257-2c61-4854-8461-f9f8abeb6a68/device_management/fetch_chart_data'

# # Function to fetch data from API with extended timeout and error handling
# async def fetch_data(deviceSerialNumber: str, dataPerPage: int = 50, page_token: dict = None):
#     request_data = {
#         "deviceSerialNumber": deviceSerialNumber,
#         "type": "modon",
#         "data_per_page": dataPerPage,
#     }

#     if page_token:
#         request_data['page_token'] = page_token

#     try:
#         # Set the timeout to 30 seconds
#         async with httpx.AsyncClient(timeout=30.0) as client:
#             response = await client.post(api_url, json=request_data)
#             response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
#             return response.json()['response']  # Return the full response

#     # Catch the ReadTimeout exception and handle it
#     except httpx.ReadTimeout:
#         print("Request timed out. Server might be slow or unreachable.")
#         raise HTTPException(status_code=504, detail="Server timeout, try again later.")
    
#     except httpx.HTTPStatusError as e:
#         print(f"HTTP error occurred: {e}")
#         raise HTTPException(status_code=500, detail="Failed to fetch data")
    
#     except Exception as e:
#         print(f"Error fetching data: {e}")
#         raise HTTPException(status_code=500, detail="Failed to fetch data")

# # Function to fetch data until the specified target date
# async def fetch_data_until_date(deviceSerialNumber: str, target_date: str, dataPerPage: int = 1000):
#     page_token = None
#     all_data = []

#     while True:
#         response = await fetch_data(deviceSerialNumber, dataPerPage, page_token)
#         payload = response['Payload']

#         if not payload:
#             break

#         for record in payload:
#             created_at = record.get('created_at', "")
#             if created_at.split("T")[0] < target_date:
#                 return all_data
#             all_data.append(record)

#         # Retrieve the next page token from the response
#         page_token = response.get('page_token', None)

#         # Break the loop if there is no next page token
#         if not page_token:
#             break

#     return all_data

# # Function to extract device information from the raw data
# def extract_device_info(raw_data):
#     device_data = raw_data[0]['property']
#     device_info = {
#         "serialNumber": device_data.get('serial number', None),
#         "macAddress": device_data.get('mac address', None),
#         "version": device_data.get('version', None),
#         "status": device_data.get('status', None),
#     }
#     return device_info

# # Main function to run the fetching logic
# async def main():
#     deviceSerialNumber = "WR2009000663"
#     target_date = "2024-10-18"  # Example date to fetch data until
#     dataPerPage = 1000

#     print("Fetching data...")
#     fetched_data = await fetch_data_until_date(deviceSerialNumber, target_date, dataPerPage)
    
#     # If data is fetched, extract and print device info
#     if fetched_data:
#         device_info = extract_device_info(fetched_data)
#         print("Device Info:", device_info)
#     else:
#         print("No data found.")

# # Run the main function
# if __name__ == "__main__":
#     asyncio.run(main())
