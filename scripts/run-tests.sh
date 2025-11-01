#!/usr/bin/env bash

# Barcha testlarni ishga tushirish uchun oddiy skript

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "🧪 VohadaIsh - Test ishga tushirish"
echo "=========================================="
echo ""

# Get to project root
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ node_modules topilmadi. O'rnatilmoqda...${NC}"
    npm install
    echo ""
fi

# 1. TypeScript typecheck
echo -e "${BLUE}📘 1. TypeScript typecheck...${NC}"
if npm run typecheck 2>/dev/null; then
    echo -e "${GREEN}✓ TypeScript: PASS${NC}\n"
else
    echo -e "${RED}✗ TypeScript: FAIL${NC}"
    echo -e "${YELLOW}  (Ba'zi xatolar bor, lekin davom etilmoqda...)${NC}\n"
fi

# 2. ESLint
echo -e "${BLUE}🔍 2. ESLint...${NC}"
if npm run lint 2>/dev/null; then
    echo -e "${GREEN}✓ ESLint: PASS${NC}\n"
else
    echo -e "${RED}✗ ESLint: FAIL${NC}"
    echo -e "${YELLOW}  (Ba'zi xatolar bor, lekin davom etilmoqda...)${NC}\n"
fi

# 3. Jest tests
echo -e "${BLUE}🧪 3. Jest testlar...${NC}"
npm run test

echo ""
echo "=========================================="
echo "✅ Barcha testlar yakunlandi!"
echo "=========================================="

