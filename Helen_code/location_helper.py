import requests
import logging
import asyncio

logger = logging.getLogger(__name__)

_cache = None
_lock = asyncio.Lock()

def _fetch_location_sync():
    try:
        logger.info("Querying ipinfo.io for location and timezone...")
        response = requests.get("https://ipinfo.io", timeout=4)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        logger.error(f"Failed to query location sync: {e}")
    return None

async def get_location_data():
    global _cache
    async with _lock:
        if _cache is None:
            data = await asyncio.to_thread(_fetch_location_sync)
            if data:
                _cache = {
                    "city": data.get("city", "Unknown"),
                    "timezone": data.get("timezone", "UTC")
                }
                logger.info(f"Location resolved and cached: {_cache}")
            else:
                _cache = {"city": "Unknown", "timezone": "UTC"}
    return _cache
