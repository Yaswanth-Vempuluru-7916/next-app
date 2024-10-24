from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from extract import fetch_data
from transform import transform_data
from calibration import load_scaling_factors, scale_values
import logging

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress 'httpx' logging at INFO level (set it to WARNING)
httpx_logger = logging.getLogger("httpx")
httpx_logger.setLevel(logging.WARNING)

# Load scaling factors
scaling_factors = load_scaling_factors('calibration.json')

# Static threshold values for energy meters
THRESHOLD_VALUES = {
    "voltage": {
        "VL1": {"V1H": 230.0, "V1L": 210.0},
        "VL2": {"V2H": 230.0, "V2L": 210.0},
        "VL3": {"V3H": 230.0, "V3L": 210.0},
    },
    "current": {
        "IR1": {"I1H": 1.8, "I1L": 0.2},
        "IR2": {"I2H": 1.8, "I2L": 0.2},
        "IR3": {"I3H": 1.8, "I3L": 0.2},
    },
    "power": {
        "KW": {
            "PW1": {"L1H": 40.0, "L1L": 0.0},
            "PW2": {"L2H": 40.0, "L2L": 0.0},
            "PW3": {"L3H": 40.0, "L3L": 0.0},
        },
        "Kvar": {
            "Kvar1": {"L1H": 700.0, "L1L": -700.0},
            "Kvar2": {"L2H": 700.0, "L2L": -700.0},
            "Kvar3": {"L3H": 700.0, "L3L": -700.0},
        },
        "KVA": {
            "KVA1": {"L1H": 50.0, "L1L": 0.0},
            "KVA2": {"L2H": 50.0, "L2L": 0.0},
            "KVA3": {"L3H": 50.0, "L3L": 0.0},
        },
        "PF": {
            "PF1": {"L1H": 1.0, "L1L": 0.9},
            "PF2": {"L2H": 1.0, "L2L": 0.9},
            "PF3": {"L3H": 1.0, "L3L": 0.9},
        },
    },
    "Frequency": {"FreqH": 60.5, "FreqL": 59.5},
}

class ResponseModel(BaseModel):
    status: str
    device_info: dict
    threshold_values: dict
    mapped_data: list

@app.get("/fetch-and-transform", response_model=ResponseModel)
async def fetch_and_transform(device_serial_number: str, start_date: str, end_date: str, max_pages: int = 50):
    try:
        # Log the message for the date range
        logger.info(f"Fetching data from the backend for the dates {start_date} to {end_date}")

        # Fetch data which now includes device_info once and mapped_data for multiple timestamps
        extracted_data = await fetch_data(device_serial_number, start_date, end_date, max_pages)

        device_info = extracted_data.get('device_info')
        data_records = extracted_data.get('data', [])

        # Scale the values for each record
        for record in data_records:
            properties = record.get("property", {})
            scaled_properties = scale_values(device_serial_number, properties, scaling_factors)
            record['property'] = scaled_properties

        # Transform the scaled data
        transformed_data = transform_data(data_records)

        # Return the response with device_info, threshold values, and mapped_data
        return {
            "status": "success",
            "device_info": device_info,
            "threshold_values": THRESHOLD_VALUES,
            "mapped_data": transformed_data
        }

    except Exception as e:
        logger.error(f"Internal Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
