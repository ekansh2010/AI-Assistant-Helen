import os
import requests
import logging
from dotenv import load_dotenv
from livekit.agents import function_tool  # ✅ Correct decorator

load_dotenv()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def detect_city_by_ip() -> str:
    try:
        response = requests.get("https://ipinfo.io", timeout=5)
        data = response.json()
        return data.get("city", "Unknown")
    except Exception as e:
        return "Unknown"

@function_tool()
async def get_weather(city: str = "") -> str:

    """
    Gives current weather information for a given city.

    Use this tool when the user asks about weather, rain, temperature, humidity, or wind.
    If no city is given, detect city automatically.

    Example prompts:
    - "आज का मौसम कैसा है?"
    - "Weather बताओ Bangalore का"
    - "क्या बारिश होगी मुंबई में?"
    """


    
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        logger.error("OpenWeather API key missing. Weather fetch is not possible.")
        return "Environment variable OPENWEATHER_API_KEY is missing. Weather fetch is not possible."

    if not city:
        city = detect_city_by_ip()

    logger.info(f"Fetching weather for {city}")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params)
        if response.status_code != 200:
            logger.error(f"There is an error with the OpenWeather API: {response.status_code} - {response.text}")
            return f"Error: {city} weather information is not available. API error: {response.status_code} - {response.text}"

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
        logger.exception(f"Weather fetch exception: {e}")
        return "Weather fetch failed due to an error."
    
