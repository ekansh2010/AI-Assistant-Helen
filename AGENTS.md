# AI Assistant Helen - Agent Instructions

## Project Overview

AI Assistant Helen is a voice-based AI assistant combining a React/Next.js frontend with a Python LiveKit Agents backend. It features real-time voice interaction, memory persistence, and MCP tool integration.

## Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS, LiveKit Client SDK
- **Backend**: Python with LiveKit Agents, LLM integration (Gemini/OpenAI), Mem0 memory system
- **Key Components**: Voice UI, chat transcription, video streaming, MCP tools

## Build & Run Commands

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format with Prettier
- Python backend: `pip install -r Helen_code/requirements.txt` then run agent.py

## Code Conventions

- **Frontend**: React function components with hooks, TypeScript strict mode, Tailwind classes
- **Backend**: Async Python with LiveKit agents, singleton ConfigManager pattern
- **Imports**: Sorted automatically via Prettier plugin
- **Path Aliases**: `@/*` maps to project root

## Key Files & Directories

- `app/` - Next.js app router pages and API routes
- `components/` - React components (livekit/, ui/, etc.)
- `Helen_code/` - Python backend code
- `hooks/` - React hooks for LiveKit integration
- `lib/` - TypeScript utilities and types

## Configuration

- User settings in `user_config.json` (created at runtime)
- App config in `app-config.ts` for theming and branding
- Python config managed by `ConfigManager` singleton

## Diff Decorations & Git Workflow

- Use ESLint and Prettier for code quality and formatting
- Renovate handles dependency updates
- Follow conventional commit messages for changes
- When reviewing diffs, focus on:
  - Type safety in TypeScript/React code
  - Async patterns in Python backend
  - Component prop interfaces
  - Memory and tool integration correctness

## Common Pitfalls

- Ensure Python environment matches requirements.txt
- LiveKit connection requires proper API keys in config
- MCP tools need server endpoints configured
- Audio visualizers depend on LiveKit track states

## Links

- [README.md](README.md) - Full project documentation
- [package.json](package.json) - Dependencies and scripts
- [tsconfig.json](tsconfig.json) - TypeScript configuration</content>
  <parameter name="filePath">c:\Users\ekans\code\AI Assistant Helen\AGENTS.md
