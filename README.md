# Leagle - Document Chat

A document-based chatbot that lets users upload PDF documents and ask natural language questions about them.

## Quick Start

```bash
# 1. Add your OpenAI API key
cp backend/.env.example backend/.env
# Edit backend/.env and set OPENAI_API_KEY=sk-...

# 2. Run
./run.sh
```

Open http://localhost:5173 in your browser.

## Project Structure

```
backend/               Django REST API
  chat/
    models.py          Document, Conversation, ChatMessage
    views.py           ViewSets for API endpoints
    services.py        PDF extraction + LangChain QA
    serializers.py     DRF serializers
    urls.py            API routing
    admin.py           Django admin config

frontend/              React + TypeScript (Vite)
  src/
    App.tsx            Main component
    types.ts           Types, constants, utilities
    api/client.ts      API client
    components/        UI components
```

## API Endpoints

| Method | Endpoint                       | Description                          |
|--------|--------------------------------|--------------------------------------|
| POST   | `/api/upload/`                 | Upload PDF, creates conversation     |
| GET    | `/api/conversations/`          | List all conversations               |
| GET    | `/api/conversations/<id>/`     | Get conversation with messages       |
| POST   | `/api/conversations/<id>/ask/` | Ask a question                       |

## Configuration

Environment variables in `backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | (required) | Your OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model to use |

## Manual Setup

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework, LangChain, PyMuPDF
- **Frontend**: React 19, TypeScript, Vite
- **LLM**: OpenAI (configurable model)
- **Database**: SQLite
