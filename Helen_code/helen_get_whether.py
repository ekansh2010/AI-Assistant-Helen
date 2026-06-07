import os
import requests
import logging
import asyncio
from dotenv import load_dotenv
from livekit.agents import function_tool
from config_manager import ConfigManager
from location_helper import get_location_data

config = ConfigManager()
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_current_city():
    loc = await get_location_data()
    return loc["city"]

def _fetch_weather_sync(url, params):
    return requests.get(url, params=params, timeout=5)

@function_tool
async def get_weather(city: str = "") -> str:
    """
    Gives current weather information for a given city.

    Use this tool when the user asks about weather, rain, temperature, humidity, or wind.
    If no city is given, detect city automatically.

    Example prompts:
    - "How's the weather in Delhi today?"
    - "What's the current temperature in Bangalore?"
    - "Is it going to rain in Mumbai?"
    """
    api_key = config.get_api_key("openweather") or os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        logger.error("OpenWeather API key missing.")
        return "Environment variables not found for OpenWeather API key"

    if not city:
        city = await get_current_city()

    logger.info(f"Fetching weather for {city}")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric"
    }

    try:
        # Run synchronous request in a separate thread to keep event loop non-blocking
        response = await asyncio.to_thread(_fetch_weather_sync, url, params)
        if response.status_code != 200:
            logger.error(f"OpenWeather API error: {response.status_code} - {response.text}")
            return f"Error: Not able to fetch weather for {city}, please check the city name or try again later."

        data = response.json()
        weather = data["weather"][0]["description"].title()
        temperature = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        wind_speed = data["wind"]["speed"]

        result = (f"Weather in {city}:\n"
                  f"- Condition: {weather}\n"
                  f"- Temperature: {temperature}°C\n"
                  f"- Humidity: {humidity}%\n"
                  f"- Wind Speed: {wind_speed} m/s")

        logger.info(f"Weather result: \n{result}")
        return result

    except Exception as e:
        logger.exception(f"Error fetching weather information: {e}")
        return "Error fetching weather information, please try again later."