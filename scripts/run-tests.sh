#!/usr/bin/env bash

# Barcha testlarni ishga tushirish uchun oddiy skript

set +e  # Don't exit on error - we want to continue

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

# Progress tracking
TOTAL_STEPS=3
CURRENT_STEP=0
PASSED=0
FAILED=0

# Function to show progress
show_progress() {
    local step_name="$1"
    local percent=$(( CURRENT_STEP * 100 / TOTAL_STEPS ))
    local filled=$(( CURRENT_STEP * 40 / TOTAL_STEPS ))
    local empty=$(( 40 - filled ))
    
    # Create progress bar
    local bar=""
    local i=0
    for ((i=0; i<filled; i++)); do
        bar="${bar}█"
    done
    for ((i=0; i<empty; i++)); do
        bar="${bar}░"
    done
    
    echo -e "\r${CYAN}[${bar}]${NC} ${BLUE}${percent}%${NC} - ${step_name}" 
}

# Use unique log names to avoid conflicts
LOGDIR="/tmp/vohadaish-logs-$$"
mkdir -p "$LOGDIR"
trap "rm -rf $LOGDIR" EXIT

# 1. TypeScript typecheck
CURRENT_STEP=1
show_progress "TypeScript tekshiruvi..."
echo ""  # New line before output
if npm run typecheck > "$LOGDIR/typecheck.log" 2>&1; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✓${NC} ${BLUE}33%${NC} - TypeScript: PASS"
else
    FAILED=$((FAILED + 1))
    echo -e "${RED}✗${NC} ${BLUE}33%${NC} - TypeScript: FAIL"
    # Show only important errors
    grep -E "error TS" "$LOGDIR/typecheck.log" | head -n 3 | while read line; do
        echo -e "${RED}  ${line}${NC}"
    done
    echo -e "${YELLOW}  (Jami xatolar: $(grep -c "error TS" "$LOGDIR/typecheck.log" || echo 0))${NC}"
fi
echo ""

# 2. ESLint
CURRENT_STEP=2
show_progress "ESLint tekshiruvi..."
echo ""  # New line before output
if npm run lint > "$LOGDIR/lint.log" 2>&1; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✓${NC} ${BLUE}66%${NC} - ESLint: PASS"
else
    FAILED=$((FAILED + 1))
    ERROR_COUNT=$(grep -E "error " "$LOGDIR/lint.log" | wc -l)
    WARNING_COUNT=$(grep -E "warning " "$LOGDIR/lint.log" | wc -l)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "${RED}✗${NC} ${BLUE}66%${NC} - ESLint: FAIL (${ERROR_COUNT} errors, ${WARNING_COUNT} warnings)"
    else
        echo -e "${YELLOW}⚠${NC} ${BLUE}66%${NC} - ESLint: PASS (${WARNING_COUNT} warnings)"
        PASSED=$((PASSED + 1))
        FAILED=$((FAILED - 1))
    fi
fi
echo ""

# 3. Jest tests
CURRENT_STEP=3
show_progress "Jest testlari..."
echo ""  # New line before output
if npm run test:unit > "$LOGDIR/jest.log" 2>&1; then
    PASSED=$((PASSED + 1))
    TESTS_INFO=$(grep -E "Test Suites:|Tests:" "$LOGDIR/jest.log" | tail -n 2)
    echo -e "${GREEN}✓${NC} ${BLUE}100%${NC} - Jest: PASS"
    echo -e "${CYAN}  ${TESTS_INFO}${NC}"
else
    FAILED=$((FAILED + 1))
    echo -e "${RED}✗${NC} ${BLUE}100%${NC} - Jest: FAIL"
    grep -E "FAIL|failing" "$LOGDIR/jest.log" | head -n 3 | while read line; do
        echo -e "${RED}  ${line}${NC}"
    done
fi
echo ""

# Final summary
echo "=========================================="
echo "📊 YAKUNIY NATIJA"
echo "=========================================="
echo -e "${GREEN}✅ Muvaffaqiyatli: ${PASSED}${NC}"
echo -e "${RED}❌ Muvaffaqiyatsiz: ${FAILED}${NC}"
echo -e "${BLUE}📦 Jami: ${TOTAL_STEPS}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Barcha testlar muvaffaqiyatli o'tdi!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Ba'zi testlar muvaffaqiyatsiz. Loglarni tekshiring.${NC}"
    exit 1
fi

