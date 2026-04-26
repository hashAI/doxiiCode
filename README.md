# Doxii

Toolkit for building and previewing storefronts and component work: FastAPI backend, web UI, component library, and agent experiments.

## UI
![Doxii — 7:33 PM](<UIScreenshots/Screenshot 2026-04-26 at 7.33.27 PM.png>)

![Doxii — 7:30 PM](<UIScreenshots/Screenshot 2026-04-26 at 7.30.52 PM.png>)

![Doxii — 7:29 PM](<UIScreenshots/Screenshot 2026-04-26 at 7.29.32 PM.png>)

![Doxii — 7:25 PM](<UIScreenshots/Screenshot 2026-04-26 at 7.25.21 PM.png>)

## Quick start

- **Backend** (API + chat preview): from `backend/`, run `python run.py` (Uvicorn on port **8010** by default). API docs: `http://localhost:8010/docs`.
- **Frontend**: see `frontend/` (e.g. `npm run dev` if you use the Vite app there).
- **Chat / static preview**: open `http://localhost:8010/preview/<chat_id>/` when the backend is running.

Use a Python env with backend dependencies installed (see `backend/requirements.txt`). Point `CMS_BASE_URL` / tenant APIs as needed for live CMS data.

## Repository layout (high level)

| Path | Purpose |
|------|---------|
| `backend/` | FastAPI app, `/preview`, `/chats`, agents integration |
| `frontend/` | Main web client |
| `component_library/` | Reusable UI components |
| `ecommerce_themes/` | Themed store scaffolds |
| `experiments/` | Scripts and agent prototypes |

More captures: [`UIScreenshots/`](UIScreenshots/)
