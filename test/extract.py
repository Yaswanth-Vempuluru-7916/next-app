from fastapi import HTTPException
import httpx
from datetime import datetime

API_URL = "https://device-services-maya.gentleplant-8ec40f17.centralindia.azurecontainerapps.io/api/device-service/v2/c09b7257-2c61-4854-8461-f9f8abeb6a68/device_management/fetch_chart_data"

# Function to make the API call
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
            response.raise_for_status()  # Check if the request was successful
            return response.json()
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in API request: {str(e)}")  # Log unexpected errors
        raise


async def fetch_page(device_serial_number: str, page_token: dict):
    return await make_api_request(device_serial_number, page_token)


async def fetch_data(device_serial_number: str, target_date: str, max_pages: int = 50):
    page_token = None
    all_data = []  # List to store all the payloads
    date_found = False  # Flag to check if we found any records for the target date

    try:
        for _ in range(max_pages):
            response_data = await fetch_page(device_serial_number, page_token)

            # Debugging: Check if the response data is valid
            if not response_data or "response" not in response_data:
                print(f"Invalid response data: {response_data}")
                raise HTTPException(status_code=500, detail="Invalid response from API")

            # Extract the payload
            payload = response_data.get("response", {}).get("Payload", [])

            # Log payload length for debugging
            print(f"Payload Length: {len(payload)}")

            # Check if payload is empty
            if len(payload) == 0:
                print("No data found in payload.")
                break  # Exit the loop if no data

            # Filter records by the specified target_date
            for record in payload[:-1]:  # Exclude the last item (page_token)
                created_at = record.get("created_at")
                if created_at:
                    # Normalize the timestamp if necessary
                    if created_at.endswith('+00:0'):
                        created_at = created_at[:-1] + '00'
                    try:
                        # Convert to date and compare
                        record_date = datetime.fromisoformat(created_at).date()
                        if record_date == datetime.fromisoformat(target_date).date():
                            all_data.append(record)
                            date_found = True  # Set flag to True if a matching record is found
                    except ValueError as ve:
                        # print(f"ValueError parsing date for record: {record}, error: {ve}")
                        continue

            # Debugging statement for found records
            if date_found:
                print(f"Records found for date {target_date}: {len(all_data)}")

            # Get the page token from the response (it's the last item in the payload)
            page_token = payload[-1].get("page_token", None) if payload else None

            # If there's no more page token, continue searching up to max_pages
            if not page_token:
                print("No more page tokens available.")
                break  # Exit the loop if there's no more page token

        # Check if any records were found
        if not all_data:
            print(f"No records found for date {target_date} after checking {max_pages} pages.")

        # Return the accumulated data
        return {"data": all_data}

    except Exception as e:
        print(f"Internal Server Error: {str(e)}")  # Log the error for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")