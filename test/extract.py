from fastapi import HTTPException
import httpx
from datetime import datetime

API_URL = "https://device-services-maya.gentleplant-8ec40f17.centralindia.azurecontainerapps.io/api/device-service/v2/c09b7257-2c61-4854-8461-f9f8abeb6a68/device_management/fetch_chart_data"

# Make the API call to get both device info and paginated data
async def make_api_request(device_serial_number: str, page_token: dict = None):
    body = {
        "deviceSerialNumber": device_serial_number,
        "type": "modon",
        "data_per_page": 1000
    }

    if page_token:
        body["page_token"] = page_token

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, json=body)
            response.raise_for_status()  # Check for HTTP errors
            return response.json()  # Return the JSON response
    except httpx.HTTPStatusError as e:
        # Log the HTTP error
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        # Handle unexpected errors
        print(f"Unexpected error in API request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Fetch device data with pagination, start and end dates
async def fetch_data(device_serial_number: str, start_date: str, end_date: str, max_pages: int = 50, stable_count_threshold: int = 3):
    page_token = None
    all_data = []
    date_found = False
    stable_count = 0
    last_record_count = 0
    device_info = {}

    try:
        # Parse the start and end dates
        start_date_obj = datetime.fromisoformat(start_date).date()
        end_date_obj = datetime.fromisoformat(end_date).date()

        # Iterate over the pages
        for _ in range(max_pages):
            # API request with optional page_token for pagination
            response_data = await make_api_request(device_serial_number, page_token)

            if not response_data or "response" not in response_data:
                print(f"Invalid response data: {response_data}")
                raise HTTPException(status_code=500, detail="Invalid response from API")

            payload = response_data.get("response", {}).get("Payload", [])

            # Extract device info once, from the first page
            if not device_info and payload:
                first_record = payload[0]
                device_info = {
                    "DVer": "Version 1.0",
                    "PVer": "Version 1.0",
                    "deviceID": first_record.get("serialNumber"),
                    "deviceCategory": "Energy Meter",
                    "sourceSitename": "Energy Site",
                    "modelName": first_record.get("property", {}).get("modelname"),
                    "deviceName": first_record.get("property", {}).get("devicename"),
                    "version": first_record.get("property", {}).get("version"),
                    "macAddress": first_record.get("property", {}).get("mac address"),
                    "serialNumber": first_record.get("property", {}).get("serial number"),
                    "IPADD": first_record.get("property", {}).get("IPADD"),
                    "status": first_record.get("property", {}).get("status"),
                }

            if len(payload) == 0:
                print("No data found in payload.")
                break

            # Iterate through the payload, excluding the last element for pagination token
            for record in payload[:-1]:
                created_at = record.get("created_at")
                if created_at:
                    if created_at.endswith('+00:0'):
                        created_at = created_at[:-1] + '00'  # Handle timezone formatting issue
                    try:
                        record_date = datetime.fromisoformat(created_at).date()
                        # Add record if it's within the date range
                        if start_date_obj <= record_date <= end_date_obj:
                            all_data.append(record)
                            date_found = True
                    except ValueError as ve:
                        # Handle invalid date format
                        print(f"ValueError parsing date for record: {record}, error: {ve}")
                        continue

            # If records for the desired date range are found, check for stable record count
            if date_found:
                current_record_count = len(all_data)
                if current_record_count == last_record_count:
                    stable_count += 1  # Increment stable count if no new records are added
                else:
                    stable_count = 0  # Reset stable count if new records are found

                if stable_count >= stable_count_threshold:
                    # Exit if records have stabilized (no new data over multiple pages)
                    break

                last_record_count = current_record_count

            # Get the next page_token from the last record for pagination
            page_token = payload[-1].get("page_token", None) if payload else None
            if not page_token:
                break  # No more pages, exit loop

        # Return the final result with device info and accumulated data
        return {"device_info": device_info, "data": all_data}

    except Exception as e:
        # Log any internal server error
        print(f"Internal Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")