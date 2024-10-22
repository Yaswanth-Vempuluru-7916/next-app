from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal, Optional
import httpx
import uvicorn
from datetime import datetime, timedelta
from transform import extract_device_info, transform_data

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

# Function to fetch raw data from the external API
async def fetch_data(deviceSerialNumber: str, dataPerPage: int):
    request_data = {
        "deviceSerialNumber": deviceSerialNumber,
        "type": "modon",
        "data_per_page": dataPerPage,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, json=request_data)
            response.raise_for_status()
            data = response.json()
            return data['response']['Payload']  # Return the full payload
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e}")
        return None
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None


@app.get("/api/fetch_graph_data/{deviceSerialNumber}/{graph_type}")
async def get_graph_data(
    deviceSerialNumber: str,
    graph_type: Literal["voltage", "current", "power", "apparent_vs_reactive_power", "total_power", "frequency"],
    time_interval: Literal["last_hour", "yesterday", "this_week", "this_month", "custom"] = "last_hour",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    data_per_page: int = 1000
):
    # Calculate start and end times based on the time_interval
    end_time = datetime.now()
    if time_interval == "last_hour":
        start_time = end_time - timedelta(hours=1)
    elif time_interval == "yesterday":
        start_time = (end_time - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(days=1)
    elif time_interval == "this_week":
        start_time = (end_time - timedelta(days=end_time.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    elif time_interval == "this_month":
        start_time = end_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif time_interval == "custom":
        if not start_date or not end_date:
            raise HTTPException(status_code=400, detail="Start and end dates are required for custom interval")
        start_time = datetime.fromisoformat(start_date)
        end_time = datetime.fromisoformat(end_date)
    else:
        raise HTTPException(status_code=400, detail="Invalid time interval")

    all_data = []
    page_token = None

    while True:
        # Fetch raw data from the backend API
        raw_data = await fetch_data(deviceSerialNumber, data_per_page, page_token)
        if not raw_data:
            raise HTTPException(status_code=500, detail="Failed to fetch data")

        # Extract the actual data and the next page token
        data = raw_data[:-1]  # All elements except the last one
        page_token = raw_data[-1].get('page_token')

        # Filter and process the data
        filtered_data = [
            record for record in data
            if 'property' in record and start_time <= datetime.fromisoformat(record['created_at']) <= end_time
        ]
        all_data.extend(filtered_data)

        # Check if we've reached the start of our time interval or if there's no more data
        if not page_token or (filtered_data and datetime.fromisoformat(filtered_data[0]['created_at']) < start_time):
            break

    # Transform the filtered data based on graph type
    transformed_data = transform_data(graph_type, all_data)
    return transformed_data

@app.get("/api/fetch_graph_data/{deviceSerialNumber}/{graph_type}")
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
    data_per_page: int = 1
):
    # Fetch raw data from the backend API
    raw_data = await fetch_data(deviceSerialNumber, data_per_page)

    if not raw_data:
        raise HTTPException(status_code=500, detail="Failed to fetch data")

    # Filter valid records and transform the data based on graph type
    valid_data = [record for record in raw_data if 'property' in record]
    transformed_data = transform_data(graph_type, valid_data)

    return transformed_data

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
