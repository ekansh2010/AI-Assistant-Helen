# Helen AI Assistant

## Overview

Helen is a real-time AI voice assistant built using Python, LiveKit, and Google Realtime AI models. It combines natural Hinglish conversation with intelligent desktop automation, allowing users to control applications, manage files, perform web searches, access live weather updates, and execute system-level tasks using voice commands.

Inspired by futuristic assistants like Jarvis, Helen is designed to provide a seamless, cinematic, and interactive AI experience with real-time responsiveness and persistent conversational memory.

---

# Features

* Real-time AI voice interaction
* Hindi, English conversational support
* Desktop application control
* File and folder management
* Keyboard and mouse automation
* Web search integration
* Live weather updates
* Persistent conversation memory
* System volume and shortcut control
* Cinematic futuristic UI
* Tool-based modular architecture

---

# Tech Stack

## Backend

* Python
* LiveKit Agents
* Google Realtime AI Model
* AsyncIO
* Pydantic

## APIs & Integrations

* Google Custom Search API
* OpenWeather API

## Automation Libraries

* PyAutoGUI
* Pynput
* PyGetWindow
* PyWin32

## Frontend

* React / Next.js
* Tailwind CSS

---

# Project Structure

```bash
Helen-AI/
│
├── agent.py
├── Helen_prompts.py
├── Helen_google_search.py
├── helen_get_weather.py
├── Helen_window_CTRL.py
├── Helen_file_opner.py
├── keyboard_mouse_CTRL.py
├── memory_loop.py
├── memory_store.py
├── requirements.txt
├── .env
└── frontend/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/helen-ai.git
cd helen-ai
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
.\venv\Scripts\Activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

# Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
SEARCH_ENGINE_ID=your_search_engine_id
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

# Running the Assistant

```bash
python agent.py
```

---

# Frontend Setup

```bash
pnpm install
pnpm dev
```

---

# How Helen Works

Helen uses a modular tool-based architecture where the AI model dynamically selects tools to perform real-world tasks. The assistant can:

* Launch or close applications
* Open files and folders
* Simulate keyboard and mouse actions
* Search the web for information
* Retrieve live weather updates
* Maintain conversational memory for contextual responses

The system combines conversational AI with actionable desktop automation to create a real-time intelligent assistant experience.

---

# Example Commands

* “Open Chrome”
* “Search latest AI news”
* “What’s the weather today?”
* “Increase volume”
* “Open my project folder”
* “Type hello world”
* “Close Notepad”

---

# Future Improvements

* Local LLM support
* Advanced task planning
* Multi-agent architecture
* Smart reminders and scheduling
* OCR and screen understanding
* Cross-platform support
* Voice cloning
* Emotion-aware responses

---

# Screenshots

<img width="2381" height="1449" alt="Screenshot 2026-05-14 140144" src="https://github.com/user-attachments/assets/aacaae26-fa93-41e0-a23d-53cf57167317" />
<img width="1566" height="1426" alt="image" src="https://github.com/user-attachments/assets/78741262-1365-4988-b8db-9f281c2e9f2e" />


---

# Author

Built by Ekansh Singh
