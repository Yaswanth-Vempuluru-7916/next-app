from fastapi import FastAPI, HTTPException
from extract import fetch_data
from transform import transform_data
from calibration import load_scaling_factors, scale_values

app = FastAPI()


scaling_factors = load_scaling_factors('calibration.json')

@app.get("/fetch-and-transform")
async def fetch_and_transform(device_serial_number: str, start_date: str, end_date: str, max_pages: int = 50):
    try:

        extracted_data = await fetch_data(device_serial_number, start_date, end_date, max_pages)

        for record in extracted_data['data']:
            properties = record.get("property", {})
            scaled_properties = scale_values(device_serial_number, properties, scaling_factors)
            record['property'] = scaled_properties

        transformed_data = transform_data(extracted_data['data'])

        return {"status": "success", "mapped_data": transformed_data}

    except Exception as e:
        print(f"Internal Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
