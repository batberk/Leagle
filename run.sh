#!/bin/bash

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cleanup() {
    kill $BACKEND_PID 2>/dev/null
}
trap cleanup EXIT

echo -e "${GREEN}=== Leagle Setup ===${NC}\n"

if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    echo -e "${YELLOW}Please edit backend/.env and add your OPENAI_API_KEY${NC}\n"
fi

echo -e "${GREEN}Setting up backend...${NC}"
cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet
python manage.py migrate --run-syncdb

echo -e "\n${GREEN}Setting up frontend...${NC}"
cd "$FRONTEND_DIR"
npm install --silent

echo -e "\n${GREEN}Starting servers...${NC}"
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo -e "Press Ctrl+C to stop\n"

cd "$BACKEND_DIR"
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

cd "$FRONTEND_DIR"
npm run dev
