#!/bin/bash

# Component Library Explorer - Quick Start Script
# This script starts both the backend and frontend servers

echo "🚀 Starting DOXII Component Library Explorer..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is already running
if lsof -Pi :8010 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Backend already running on port 8010${NC}"
else
    echo -e "${BLUE}📦 Starting Backend Server...${NC}"
    cd backend
    python run.py &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    cd ..
fi

# Wait a moment for backend to initialize
sleep 2

# Check if frontend is already running
if lsof -Pi :3010 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 3010${NC}"
else
    echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    cd ..
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Component Library Explorer is Ready!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "🌐 Open your browser and visit:"
echo -e "${BLUE}   http://localhost:3010/components-library${NC}"
echo ""
echo -e "📚 API Documentation:"
echo -e "   Backend API: ${BLUE}http://localhost:8010/docs${NC}"
echo ""
echo -e "📊 Statistics:"
echo -e "   • 34 Components"
echo -e "   • 11 Categories"
echo -e "   • Search, Preview, Code View"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Keep script running and handle Ctrl+C
trap "echo -e '\n${YELLOW}Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for servers
wait

