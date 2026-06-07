import os
import subprocess
import sys
import logging
import asyncio
import shutil
try:
    import pygetwindow as gw
except ImportError:
    gw = None

from livekit.agents import function_tool

sys.stdout.reconfigure(encoding='utf-8')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Common Windows Applications mapping
COMMON_APPS = {
    "notepad": "notepad.exe",
    "calculator": "calc.exe",
    "calc": "calc.exe",
    "paint": "mspaint.exe",
    "mspaint": "mspaint.exe",
    "cmd": "cmd.exe",
    "command prompt": "cmd.exe",
    "powershell": "powershell.exe",
    "explorer": "explorer.exe",
    "chrome": "chrome.exe",
    "google chrome": "chrome.exe",
    "edge": "msedge.exe",
    "msedge": "msedge.exe",
    "word": "winword.exe",
    "excel": "excel.exe",
    "powerpoint": "powerpnt.exe",
    "spotify": "spotify.exe",
    "task manager": "taskmgr.exe",
    "taskmgr": "taskmgr.exe",
}

# Common Windows Folders mapping
COMMON_FOLDERS = {
    "desktop": os.path.join(os.path.expanduser("~"), "Desktop"),
    "documents": os.path.join(os.path.expanduser("~"), "Documents"),
    "downloads": os.path.join(os.path.expanduser("~"), "Downloads"),
    "music": os.path.join(os.path.expanduser("~"), "Music"),
    "videos": os.path.join(os.path.expanduser("~"), "Videos"),
    "pictures": os.path.join(os.path.expanduser("~"), "Pictures"),
    "user folder": os.path.expanduser("~"),
}

async def focus_window(title_keyword: str) -> bool:
    if not gw:
        logger.warning("⚠ pygetwindow not installed.")
        return False

    await asyncio.sleep(1.5)
    title_keyword = title_keyword.lower().strip()

    for window in gw.getAllWindows():
        if title_keyword in window.title.lower():
            if window.isMinimized:
                window.restore()
            window.activate()
            logger.info(f"🪟 window focus: {window.title}")
            return True
    logger.warning("⚠ Matching Window not found to focus.")
    return False

async def index_files(base_dirs):
    file_index = []
    # Exclude common large development/system directories to keep it fast
    exclude_dirs = {
        "node_modules", "venv", ".venv", ".git", ".next", "AppData", 
        "Program Files", "Program Files (x86)", "Windows", "System32",
        "Library", "Local Settings", "Temporary Internet Files", "Cache"
    }
    
    for base_dir in base_dirs:
        if not os.path.exists(base_dir):
            continue
        logger.info(f"Indexing directory: {base_dir}")
        try:
            count = 0
            for root, dirs, files in os.walk(base_dir):
                # Prune excluded directories in-place
                dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
                
                for f in files:
                    # Ignore temp/hidden files
                    if f.startswith('~') or f.startswith('.'):
                        continue
                    
                    file_index.append({
                        "name": f,
                        "path": os.path.join(root, f),
                        "type": "file"
                    })
                    count += 1
                    # Hard limit per base dir to prevent slow-down
                    if count >= 3000:
                        break
                if count >= 3000:
                    break
        except Exception as e:
            logger.error(f"Error walking {base_dir}: {e}")
            
    logger.info(f"✅ Indexed {len(file_index)} files.")
    return file_index

# File index cache variables to optimize tool calling speed
_file_index_cache = None
_indexing_lock = asyncio.Lock()

async def get_or_build_index(folders_to_index):
    global _file_index_cache
    async with _indexing_lock:
        if _file_index_cache is None:
            logger.info("Initializing in-memory file index...")
            _file_index_cache = await index_files(folders_to_index)
            # Create a background task to keep it fresh
            asyncio.create_task(periodic_refresh(folders_to_index))
        return _file_index_cache

async def periodic_refresh(folders_to_index):
    global _file_index_cache
    while True:
        await asyncio.sleep(120)  # Refresh index every 2 minutes
        logger.info("Refreshing file index in background...")
        try:
            new_index = await index_files(folders_to_index)
            async with _indexing_lock:
                _file_index_cache = new_index
            logger.info("Background file index refresh complete.")
        except Exception as e:
            logger.error(f"Error refreshing file index in background: {e}")

async def search_file(query, index):
    from fuzzywuzzy import process
    choices = [item["name"] for item in index]
    if not choices:
        logger.warning("⚠ No files indexed to search from.")
        return None

    best_match, score = process.extractOne(query, choices)
    logger.info(f"🔍 Matched '{query}' to '{best_match}' (Score: {score})")
    if score > 70:
        for item in index:
            if item["name"] == best_match:
                return item
    return None

async def open_file(item):
    try:
        logger.info(f"📂 Opening File: {item['path']}")
        if os.name == 'nt':
            os.startfile(item["path"])
        else:
            subprocess.call(['open' if sys.platform == 'darwin' else 'xdg-open', item["path"]])
        await focus_window(item["name"])
        return f"✅ File opened: {item['name']}"
    except Exception as e:
        logger.error(f"❌ Error opening file: {e}")
        return f"❌ Failed to open file: {e}"

def clean_name(name: str) -> str:
    cleaned = name.lower().strip()
    for prefix in ["open ", "run ", "launch ", "start ", "play "]:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):].strip()
    return cleaned

@function_tool
async def Play_file(name: str) -> str:
    """
    Searches for and opens a file, folder, or system application by name on the user's computer.

    Use this tool when the user wants to open an application (like Notepad, Calculator, Chrome, Paint),
    a system folder (like Downloads, Desktop, Documents), or any files they specify.

    Arguments:
    name: The name of the file, folder, or application to open (e.g. "notepad", "downloads", "project report.pdf").
    """
    cleaned = clean_name(name)
    logger.info(f"Play_file invoked with name: {name} (cleaned: {cleaned})")

    # 1. Check if it's a common application
    if cleaned in COMMON_APPS:
        app_exe = COMMON_APPS[cleaned]
        try:
            logger.info(f"Launching application: {app_exe}")
            subprocess.Popen(app_exe, shell=True)
            return f"✅ Opened application: {name}"
        except Exception as e:
            logger.error(f"Error launching {app_exe}: {e}")
            return f"❌ Failed to open application {name}: {e}"

    # 2. Check if the name exists in PATH as an executable
    exe_path = shutil.which(cleaned) or shutil.which(cleaned + ".exe")
    if exe_path:
        try:
            logger.info(f"Launching from PATH: {exe_path}")
            subprocess.Popen(exe_path, shell=True)
            return f"✅ Opened application: {name}"
        except Exception as e:
            logger.error(f"Error launching {exe_path}: {e}")
            return f"❌ Failed to open application {name}: {e}"

    # 3. Check if it's a common folder
    if cleaned in COMMON_FOLDERS:
        folder_path = COMMON_FOLDERS[cleaned]
        if os.path.exists(folder_path):
            try:
                logger.info(f"Opening folder: {folder_path}")
                os.startfile(folder_path)
                return f"✅ Opened folder: {name}"
            except Exception as e:
                logger.error(f"Error opening folder {folder_path}: {e}")
                return f"❌ Failed to open folder {name}: {e}"

    # 4. Handle C/D drives directly
    if cleaned in ["d drive", "d:", "d:/"]:
        if os.path.exists("D:/"):
            os.startfile("D:/")
            return "✅ Opened D drive."
        else:
            return "❌ D drive is not available."
    if cleaned in ["c drive", "c:", "c:/"]:
        os.startfile("C:/")
        return "✅ Opened C drive."

    # 5. Search for files in indexed directories (cached in-memory)
    user_home = os.path.expanduser("~")
    folders_to_index = [
        os.path.join(user_home, "Desktop"),
        os.path.join(user_home, "Documents"),
        os.path.join(user_home, "Downloads"),
        os.getcwd() # Workspace folder
    ]
    if os.path.exists("D:/"):
        folders_to_index.append("D:/")

    index = await get_or_build_index(folders_to_index)
    item = await search_file(cleaned, index)
    if item:
        return await open_file(item)
    
    # 6. Fallback - try running it as a generic shell start command
    try:
        logger.info(f"Fallback: running start command for {cleaned}")
        subprocess.Popen(f"start {cleaned}", shell=True)
        return f"✅ Executed start command for: {name}"
    except Exception as e:
        logger.error(f"Fallback run failed: {e}")
        return f"❌ Could not find or open any application, folder, or file named '{name}'."