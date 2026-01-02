#!/bin/bash

# HRMS Backend Setup Script
# This script initializes the backend environment

echo "🚀 HRMS Backend Setup"
echo "════════════════════════════════════════════"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if PostgreSQL is running (optional)
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL found${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found in PATH${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo -e "${BLUE}📝 Creating .env from .env.example${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please update DATABASE_URL and JWT_SECRET in .env${NC}"
fi

echo ""
echo -e "${BLUE}🔧 TypeScript Configuration${NC}"
npm run type-check

echo ""
echo "════════════════════════════════════════════"
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update DATABASE_URL in .env file"
echo "2. Create PostgreSQL database: createdb hrms_db"
echo "3. Run migrations: npm run prisma:migrate"
echo "4. Seed database: npm run prisma:seed"
echo "5. Start server: npm run dev"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- Backend README: ./README.md"
echo "- Database Schema: ./DATABASE_SCHEMA.md"
echo "- Setup Guide: ../BACKEND_SETUP.md"
echo ""
