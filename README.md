# 🤖 AI Assistant Helen

<p align="center">
  <b>A Futuristic, Real-Time AI Voice Assistant & Desktop Automation Companion</b>
</p>

<p align="center">
  Built with Next.js 15 • React 19 • Python • LiveKit Agents • Gemini Realtime • Mem0
</p>

---

## 📌 Overview

**Helen** is an advanced real-time voice assistant combining a next-generation React/Next.js frontend with a Python LiveKit Agents backend. Inspired by cinematic AI interfaces, Helen provides an immersive, interactive HUD cockpit while performing seamless speech interaction, persistent memory indexing, web searches, live weather queries, and local desktop automation.

---

## 🎯 Key Features

- **Real-Time Speech Interaction**: Low-latency voice-to-voice communication powered by LiveKit and Gemini's Audio model.
- **Dynamic Language Selection**: Support for Hindi, English, and Hinglish. Telemetry readouts display active spoken language config dynamically.
- **Futuristic AI HUD Cockpit**: Sleek sci-fi dashboard utilizing:
  - Concentric rotating technological rings.
  - Translucent holographic floating cards with neon corner brackets.
  - Simulated real-time CPU & RAM dials using rotating SVG radial circle progress meters.
  - State-reactive ambient glows (listening, thinking, speaking, and standby) changing the visual state dynamically.
- **Monospace Neon Terminal Chats**: Monospace speech transcription bubbles formatted in glowing cyan for Helen and deep purple for the user.
- **Continuous Listening**: Continuous hands-free uplink stream bypassing frequent auto-muting watchdogs.
- **Intelligent Windows Desktop Automation**:
  - Launch standard applications (`notepad`, `calc`, `chrome`, `cmd`, etc.) and system command routes.
  - Query folders (Desktop, Documents, Downloads, Workspace) dynamically.
  - Background directory indexing with cache invalidation to respond instantly.
- **Location-Aware Datetime & Weather**: Resolves location coordinates and timezone offsets dynamically to calculate local time and coordinate weather widgets.
- **Web Search Integration**: Performs live Google searches using Google Custom Search engine and reads/translates context.
- **Persistent Long-Term Memory**: Integrates Mem0 Cloud memory persistence for contextual continuity across session reboots.

---

## 🛠️ Architecture & Tech Stack

### 1. Frontend

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **RTC Streaming**: LiveKit Client SDK
- **Animation**: Motion (Framer Motion)
- **UI Components**: Shadcn UI & Lucide Icons

### 2. Backend

- **Core**: Python 3.10+ (Asyncio event loop)
- **Agent Framework**: LiveKit Agents SDK
- **Model**: Google Gemini Pro Realtime (via Gemini API)
- **Memory**: Mem0
- **Automation**: PyAutoGUI, PyGetWindow, PyWin32, Pynput

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+) & `pnpm`
- Python (v3.10+) & `pip`
- LiveKit Server instance / Cloud Sandbox API keys

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/helen-ai.git
cd helen-ai
```

---

### Step 2: Configure Environment Variables

Create a `.env` (or `.env.local` for frontend) file in both the project root directory and `Helen_code/` folder:

```env
# LiveKit Credentials
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# AI Models & Services
GOOGLE_API_KEY=your_gemini_api_key
MEM0_API_KEY=your_mem0_cloud_key

# Tools
GOOGLE_SEARCH_API_KEY=your_google_custom_search_key
SEARCH_ENGINE_ID=your_search_engine_cx_id
OPENWEATHER_API_KEY=your_openweather_map_key
```

---

### Step 3: Set Up the Python Backend

1. Navigate to the codebase directory and create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```
3. Install the required Python dependencies:
   ```bash
   pip install -r Helen_code/requirements.txt
   ```
4. Start the backend LiveKit agent:
   ```bash
   python Helen_code/agent.py dev
   ```

---

### Step 4: Set Up the Frontend

1. Install Node dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
2. Start the local Next.js development server:
   ```bash
   pnpm dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🔧 Project Configuration

- **User Preferences**: Spoken language, assistant name, and custom wake word thresholds are managed in `user_config.json` (saved dynamically at runtime).
- **App Branding**: App titles, defaults, and capabilities are configured in [app-config.ts](app-config.ts).
- **Backend Settings**: Configuration managers read and write directly to system preferences, keeping the core updated.

---

## 🧪 Developer Commands

| Command                          | Action                                    |
| -------------------------------- | ----------------------------------------- |
| `pnpm dev`                       | Starts frontend development server        |
| `pnpm build`                     | Compiles frontend production bundle       |
| `pnpm start`                     | Runs frontend production server           |
| `pnpm lint`                      | Runs ESLint analysis checks               |
| `pnpm format`                    | Formats codebase using Prettier           |
| `python Helen_code/agent.py dev` | Launches backend agent in dev reload mode |

---

## 💬 Example Commands

Try speaking to Helen with these instructions:

- _“What is the weather in New Delhi right now?”_
- _“Search for latest developments in space exploration.”_
- _“Open Notepad and write hello world.”_
- _“Open my downloads folder.”_
- _“Can you translate this sentence into Spanish?”_
- _“Increase the system volume.”_

---

## 👥 Authors & Contribution

- **Ekansh Singh** - Lead Developer & Creator
- Open source contributions and pull requests are welcome!

---
