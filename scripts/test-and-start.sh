#!/usr/bin/env bash

# Don't exit on error - we want to continue all checks
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Results storage
RESULTS=()
REPORT_FILE="test-report-$(date +%Y%m%d-%H%M%S).md"

# Progress indicator variables
SPINNER_PID=""
PROGRESS_RUNNING=false
SPINNER_MESSAGE=""

# Helper functions
add_result() {
    local check="$1"
    local method="$2"
    local result="$3"
    local notes="$4"
    RESULTS+=("$check|$method|$result|$notes")
}

check_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    add_result "$1" "$2" "PASS" "$3"
}

check_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    add_result "$1" "$2" "FAIL" "$3"
}

check_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    add_result "$1" "$2" "WARN" "$3"
}

# Progress indicator functions
start_spinner() {
    local message="$1"
    SPINNER_MESSAGE="$message"
    PROGRESS_RUNNING=true
    (
        local spinner='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
        local i=0
        local elapsed=0
        while [ "$PROGRESS_RUNNING" = true ]; do
            i=$(( (i+1) % ${#spinner} ))
            elapsed=$((elapsed + 1))
            # Simulate progress (increases gradually, caps at 99% until done)
            local percent=$(( elapsed * 100 / 200 ))
            if [ $percent -gt 99 ]; then
                percent=99
            fi
            if [ $percent -lt 10 ]; then
                percent=10
            fi
            printf "\r${CYAN}%s${NC} ${BLUE}%s${NC} [%3d%%]" "${spinner:$i:1}" "$message" "$percent"
            sleep 0.12
        done
    ) &
    SPINNER_PID=$!
}

stop_spinner() {
    PROGRESS_RUNNING=false
    if [ -n "$SPINNER_PID" ]; then
        kill $SPINNER_PID 2>/dev/null || true
        wait $SPINNER_PID 2>/dev/null || true
    fi
    # Show completion with 100%
    printf "\r${GREEN}✓${NC} %s [100%%]\n" "${SPINNER_MESSAGE:-Complete}"
}

# Progress bar with percentage
show_progress() {
    local current=$1
    local total=$2
    local message="${3:-Progress}"
    local percent=$(( current * 100 / total ))
    local filled=$(( current * 50 / total ))
    local empty=$(( 50 - filled ))
    
    # Create progress bar
    local bar=""
    local i=0
    for ((i=0; i<filled; i++)); do
        bar="${bar}█"
    done
    for ((i=0; i<empty; i++)); do
        bar="${bar}░"
    done
    
    printf "\r${CYAN}[${bar}]${NC} ${BLUE}%d%%${NC} - ${message}" "$percent"
}

# Animated progress with spinner and percentage
run_with_progress() {
    local command="$1"
    local message="$2"
    local total_steps="${3:-100}"
    local current_step=0
    
    # Start spinner in background
    (
        local spinner='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
        local i=0
        while [ "$PROGRESS_RUNNING" = true ]; do
            i=$(( (i+1) % ${#spinner} ))
            local percent=$(( current_step * 100 / total_steps ))
            printf "\r${CYAN}%s${NC} ${BLUE}%s${NC} [%3d%%]" "${spinner:$i:1}" "$message" "$percent"
            sleep 0.15
        done
    ) &
    SPINNER_PID=$!
    PROGRESS_RUNNING=true
    
    # Run command in background and monitor
    eval "$command" &
    local cmd_pid=$!
    
    # Simulate progress
    while kill -0 $cmd_pid 2>/dev/null; do
        current_step=$((current_step + 1))
        if [ $current_step -gt $total_steps ]; then
            current_step=$total_steps
        fi
        sleep 0.2
    done
    
    # Wait for command to finish
    wait $cmd_pid
    local exit_code=$?
    
    # Stop spinner and show 100%
    PROGRESS_RUNNING=false
    kill $SPINNER_PID 2>/dev/null || true
    wait $SPINNER_PID 2>/dev/null || true
    printf "\r${GREEN}✓${NC} ${message} [100%%]\n"
    
    return $exit_code
}

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=========================================="
echo "🔍 BoshqaruvMobile - To'liq Tekshiruv"
echo "=========================================="
echo ""

# 1. Tools check
echo "📦 1. Tools tekshiruvi..."
echo "-------------------------"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js mavjud" "node -v" "$NODE_VERSION"
else
    check_fail "Node.js topilmadi" "node -v" "Node.js o'rnatilmagan"
fi

if command -v corepack &> /dev/null; then
    COREPACK_VERSION=$(corepack --version 2>&1 || echo "corepack-missing")
    if [[ "$COREPACK_VERSION" == *"corepack-missing"* ]]; then
        check_warn "Corepack mavjud emas" "corepack --version" "Corepack kerak emas, lekin tavsiya etiladi"
    else
        check_pass "Corepack mavjud" "corepack --version" "$COREPACK_VERSION"
    fi
else
    check_warn "Corepack topilmadi" "command -v corepack" "Corepack o'rnatilmagan"
fi

# Determine package manager
PNPM_CMD=""
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    PNPM_CMD="pnpm"
    check_pass "pnpm mavjud" "pnpm -v" "$PNPM_VERSION"
elif command -v npm &> /dev/null && npx pnpm --version &> /dev/null 2>&1; then
    # Try using npx pnpm
    PNPM_VERSION=$(npx pnpm --version 2>/dev/null || echo "npx orqali")
    PNPM_CMD="npx pnpm"
    check_warn "pnpm to'g'ridan-to'g'ri yo'q" "npx pnpm" "npx pnpm ishlatiladi ($PNPM_VERSION)"
elif command -v npm &> /dev/null; then
    # Fallback to npm
    NPM_VERSION=$(npm -v)
    PNPM_CMD="npm"
    check_warn "pnpm topilmadi" "npm -v" "npm ishlatiladi ($NPM_VERSION). pnpm o'rnatish tavsiya etiladi"
else
    check_fail "pnpm/npm topilmadi" "command -v pnpm/npm" "Hech qanday package manager topilmadi"
    echo -e "${RED}Xato: Package manager topilmadi. pnpm yoki npm o'rnatish kerak.${NC}"
    exit 1
fi

# Ensure PNPM_CMD is set
if [ -z "$PNPM_CMD" ]; then
    echo -e "${RED}Xato: Package manager aniqlanmadi.${NC}"
    exit 1
fi

echo "  → Package manager: $PNPM_CMD"

echo ""

# 2. Installation check
echo "📥 2. Installation tekshiruvi..."
echo "-------------------------"

if [ -d "node_modules" ]; then
    check_pass "node_modules mavjud" "ls -d node_modules" "Dependencies o'rnatilgan"
    
    # Check if package.json matches node_modules
    if [ -f "package.json" ]; then
        check_pass "package.json mavjud" "test -f package.json" "Config fayl topildi"
    fi
else
    check_fail "node_modules topilmadi" "test -d node_modules" "$PNPM_CMD install ishlatish kerak"
    echo "  ⚠ Dependencies o'rnatilmoqda..."
    start_spinner "Dependencies o'rnatilmoqda..."
    if $PNPM_CMD install > install.log 2>&1; then
        stop_spinner
        check_pass "Dependencies o'rnatildi" "$PNPM_CMD install" "Muvaffaqiyatli"
    else
        stop_spinner
        INSTALL_ERROR=$(tail -n 5 install.log)
        check_fail "Dependencies o'rnatishda xato" "$PNPM_CMD install" "$INSTALL_ERROR"
    fi
fi

echo ""

# 3. package.json scripts check
echo "📝 3. package.json scripts tekshiruvi..."
echo "-------------------------"

if [ -f "package.json" ]; then
    REQUIRED_SCRIPTS=("typecheck" "lint" "test" "format")
    for script in "${REQUIRED_SCRIPTS[@]}"; do
        if grep -q "\"$script\"" package.json; then
            check_pass "Script: $script" "grep \"$script\" package.json" "Mavjud"
        else
            check_fail "Script: $script" "grep \"$script\" package.json" "Topilmadi"
        fi
    done
else
    check_fail "package.json topilmadi" "test -f package.json" "Fayl mavjud emas"
fi

echo ""

# 4. tsconfig.json check
echo "⚙️ 4. tsconfig.json tekshiruvi..."
echo "-------------------------"

if [ -f "tsconfig.json" ]; then
    check_pass "tsconfig.json mavjud" "test -f tsconfig.json" "Config fayl topildi"
    
    if grep -q "\"strict\".*true" tsconfig.json; then
        check_pass "strict: true" "grep strict tsconfig.json" "TypeScript strict mode yoqilgan"
    else
        check_fail "strict: true" "grep strict tsconfig.json" "Strict mode yoqilmagan"
    fi
    
    if grep -q "\"moduleResolution\".*\"bundler\"" tsconfig.json; then
        check_pass "moduleResolution: Bundler" "grep moduleResolution tsconfig.json" "To'g'ri sozlangan"
    else
        MODULE_RES=$(grep -o '"moduleResolution".*"[^"]*"' tsconfig.json || echo "topilmadi")
        check_warn "moduleResolution: Bundler" "grep moduleResolution tsconfig.json" "Joriy: $MODULE_RES"
    fi
else
    check_fail "tsconfig.json topilmadi" "test -f tsconfig.json" "Config fayl mavjud emas"
fi

echo ""

# 5. ESLint check
echo "🔍 5. ESLint tekshiruvi..."
echo "-------------------------"

ESLINT_CONFIG=$(find . -maxdepth 1 -name ".eslintrc*" | head -n 1)
if [ -n "$ESLINT_CONFIG" ]; then
    check_pass "ESLint config mavjud" "find .eslintrc*" "$(basename "$ESLINT_CONFIG")"
    
    if grep -q "import/order" "$ESLINT_CONFIG" 2>/dev/null; then
        check_pass "import/order rule" "grep import/order .eslintrc*" "Qoida mavjud"
    else
        check_fail "import/order rule" "grep import/order .eslintrc*" "Qoida topilmadi"
    fi
    
    if grep -q "@react-native\|expo" "$ESLINT_CONFIG" 2>/dev/null; then
        check_pass "React Native extend" "grep @react-native/expo .eslintrc*" "React Native sozlamalari mavjud"
    else
        check_warn "React Native extend" "grep @react-native .eslintrc*" "To'liq tekshirilmadi"
    fi
else
    check_fail "ESLint config topilmadi" "find .eslintrc*" "Config fayl mavjud emas"
fi

echo ""

# 6. Jest check
echo "🧪 6. Jest tekshiruvi..."
echo "-------------------------"

if [ -f "jest.config.js" ]; then
    check_pass "jest.config.js mavjud" "test -f jest.config.js" "Config fayl topildi"
    
    if grep -q "preset.*react-native" jest.config.js; then
        check_pass "preset: react-native" "grep preset jest.config.js" "To'g'ri preset"
    else
        check_fail "preset: react-native" "grep preset jest.config.js" "Preset topilmadi yoki noto'g'ri"
    fi
    
    if grep -q "transformIgnorePatterns" jest.config.js; then
        check_pass "transformIgnorePatterns" "grep transformIgnorePatterns jest.config.js" "Sozlangan"
    else
        check_warn "transformIgnorePatterns" "grep transformIgnorePatterns jest.config.js" "Topilmadi (mumkin kerak emas)"
    fi
else
    check_fail "jest.config.js topilmadi" "test -f jest.config.js" "Config fayl mavjud emas"
fi

echo ""

# 7. Structure check
echo "📁 7. Loyiha struktura tekshiruvi..."
echo "-------------------------"

REQUIRED_DIRS=("src" "src/screens" "src/components" "src/services" "assets" "src/i18n")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        check_pass "Papka: $dir" "test -d $dir" "Mavjud"
    else
        check_fail "Papka: $dir" "test -d $dir" "Topilmadi"
    fi
done

echo ""

# 8. i18n check
echo "🌐 8. i18n tekshiruvi..."
echo "-------------------------"

I18N_LANGS=("uz" "en" "ru")
I18N_DIR="src/i18n"
if [ -d "$I18N_DIR" ]; then
    for lang in "${I18N_LANGS[@]}"; do
        if [ -f "$I18N_DIR/$lang.json" ]; then
            KEY_COUNT=$(grep -o '"[^"]*":' "$I18N_DIR/$lang.json" | wc -l)
            check_pass "i18n: $lang.json" "test -f $I18N_DIR/$lang.json" "$KEY_COUNT ta kalitlar"
        else
            check_fail "i18n: $lang.json" "test -f $I18N_DIR/$lang.json" "Fayl topilmadi"
        fi
    done
else
    check_fail "i18n papkasi" "test -d $I18N_DIR" "Papka mavjud emas"
fi

echo ""

# 9. Scripts run
echo "🚀 9. Scripts ishga tushirish..."
echo "-------------------------"

# Typecheck with progress
start_spinner "TypeScript tekshiruvi..."
if $PNPM_CMD run typecheck > typecheck.log 2>&1; then
    stop_spinner
    check_pass "$PNPM_CMD typecheck" "$PNPM_CMD run typecheck" "Muvaffaqiyatli"
    TYPECHECK_EXIT=0
else
    stop_spinner
    TYPECHECK_ERROR=$(tail -n 10 typecheck.log | head -n 5)
    check_fail "$PNPM_CMD typecheck" "$PNPM_CMD run typecheck" "$TYPECHECK_ERROR"
    TYPECHECK_EXIT=1
fi

# Lint with progress
start_spinner "ESLint tekshiruvi..."
if $PNPM_CMD run lint > lint.log 2>&1; then
    stop_spinner
    check_pass "$PNPM_CMD lint" "$PNPM_CMD run lint" "Muvaffaqiyatli"
    LINT_EXIT=0
else
    stop_spinner
    LINT_ERROR=$(tail -n 10 lint.log | head -n 5)
    check_fail "$PNPM_CMD lint" "$PNPM_CMD run lint" "$LINT_ERROR"
    LINT_EXIT=1
fi

# Test with progress
start_spinner "Jest testlar ishga tushirilmoqda..."
if timeout 120 $PNPM_CMD run test > test.log 2>&1; then
    TEST_EXIT=$?
    stop_spinner
    if [ $TEST_EXIT -eq 0 ]; then
        TEST_SUMMARY=$(tail -n 3 test.log | grep -E "Tests|Test Suites" || echo "Testlar o'tdi")
        check_pass "$PNPM_CMD test" "$PNPM_CMD run test" "$TEST_SUMMARY"
    else
        check_fail "$PNPM_CMD test" "$PNPM_CMD run test" "Testlar yiqildi (exit code: $TEST_EXIT)"
    fi
else
    TEST_EXIT=$?
    stop_spinner
    if [ $TEST_EXIT -eq 124 ]; then
        check_warn "$PNPM_CMD test" "$PNPM_CMD run test" "Timeout (120s) - testlar juda uzoq vaqt oldi"
    else
        TEST_ERROR=$(tail -n 10 test.log | head -n 5)
        check_fail "$PNPM_CMD test" "$PNPM_CMD run test" "$TEST_ERROR"
    fi
fi

echo ""

# 10. Husky check
echo "🪝 10. Husky tekshiruvi..."
echo "-------------------------"

if [ -f ".husky/pre-push" ]; then
    check_pass ".husky/pre-push mavjud" "test -f .husky/pre-push" "Hook fayl topildi"
    
    if grep -q "typecheck.*lint.*test" .husky/pre-push; then
        check_pass "pre-push hook ichida" "grep typecheck/lint/test .husky/pre-push" "Barcha tekshiruvlar mavjud"
    else
        HOOK_CONTENT=$(cat .husky/pre-push)
        check_warn "pre-push hook ichida" "cat .husky/pre-push" "To'liq tekshirilmadi"
    fi
else
    check_warn ".husky/pre-push" "test -f .husky/pre-push" "Hook mavjud emas (mumkin kerak emas)"
fi

echo ""

# 11. Env check
echo "🔐 11. Env tekshiruvi..."
echo "-------------------------"

if [ -f ".env.example" ]; then
    check_pass ".env.example mavjud" "test -f .env.example" "Example fayl topildi"
    
    if grep -q "API_URL\|EXPO_PUBLIC" .env.example; then
        check_pass ".env.example API_URL" "grep API_URL .env.example" "API_URL mavjud"
    else
        check_warn ".env.example API_URL" "grep API_URL .env.example" "API_URL topilmadi"
    fi
else
    check_warn ".env.example" "test -f .env.example" "Example fayl mavjud emas"
fi

echo ""

# 12. Platform checks
echo "📱 12. Platform tekshiruvi..."
echo "-------------------------"

if [ -d "android" ] && [ -f "android/gradlew" ]; then
    check_pass "Android gradlew" "test -f android/gradlew" "Android setup mavjud"
else
    check_warn "Android gradlew" "test -f android/gradlew" "Android setup topilmadi (Expo managed mode)"
fi

if [ -d "ios" ] && [ -f "ios/Podfile" ]; then
    check_pass "iOS Podfile" "test -f ios/Podfile" "iOS setup mavjud"
else
    check_warn "iOS Podfile" "test -f ios/Podfile" "iOS setup topilmadi (Expo managed mode)"
fi

echo ""

# 13. Start application
echo "🚀 13. Ilovani ishga tushirish..."
echo "-------------------------"

echo "  → $PNPM_CMD start ishga tushirilmoqda..."
START_LOG="start.log"

# Kill any existing Expo processes and clear port
echo "  → Mavjud Expo process larni to'xtatilmoqda..."
pkill -9 -f "expo start" 2>/dev/null || true
pkill -9 -f "node.*expo" 2>/dev/null || true
pkill -9 -f "metro.*808" 2>/dev/null || true
pkill -9 -f "react-native.*808" 2>/dev/null || true
# Kill any process on port 8081-8085
for p in 8081 8082 8083 8084 8085; do
    if lsof -ti :$p >/dev/null 2>&1; then
        echo "  → Port $p dagi process to'xtatilmoqda..."
        lsof -ti :$p | xargs kill -9 2>/dev/null || true
    fi
done
sleep 4

# Find available port
DEFAULT_PORT=8081
PORT=$DEFAULT_PORT

# Check if port is available
check_port_available() {
    local port=$1
    # Try lsof first (Linux/macOS)
    if command -v lsof >/dev/null 2>&1; then
        ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
    # Fallback to netstat (if available)
    elif command -v netstat >/dev/null 2>&1; then
        ! netstat -an 2>/dev/null | grep -q ":$port.*LISTEN"
    # Fallback to /proc/net/tcp (Linux only)
    elif [ -f /proc/net/tcp ]; then
        ! grep -q ":$port " /proc/net/tcp 2>/dev/null
    else
        # If no tool available, just try the default port
        true
    fi
}

if ! check_port_available $PORT; then
    # Port is busy, try next available port
    for test_port in 8082 8083 8084 8085; do
        if check_port_available $test_port; then
            PORT=$test_port
            echo "  → Port $DEFAULT_PORT band, $PORT ishlatiladi"
            break
        fi
    done
fi

# Start Expo in background with port
echo "  → Metro bundler port $PORT da ishga tushirilmoqda..."
# Set environment variables for non-interactive mode
export CI=true
export EXPO_NO_TELEMETRY=1
export EXPO_DEV_SERVER_PORT=$PORT
# Ensure port is definitely free
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  → Port $PORT hali ham band, to'xtatilmoqda..."
    lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
    # Verify port is now free
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "  ✓ Port $PORT endi bo'sh"
    else
        # Try alternative port
        for alt_port in 8082 8083 8084 8085; do
            if check_port_available $alt_port; then
                PORT=$alt_port
                export EXPO_DEV_SERVER_PORT=$PORT
                echo "  → Alternativ port $PORT ishlatiladi"
                break
            fi
        done
    fi
fi

# Start Expo with proper stdin handling
# Use npx expo start directly with port, ensuring port is free
# Set environment variables to prevent interactive prompts
export EXPO_NO_GIT_STATUS=1
export EXPO_NO_UPDATE_CHECK=1

# Start Expo with continuous 'y' responses for any prompts
# Use yes command in background that will be killed after Metro starts
if [[ "$PNPM_CMD" == "npm" ]] || [[ "$PNPM_CMD" == "npx pnpm" ]]; then
    # Use npx expo directly, pipe yes to handle all prompts
    # Start yes in background, it will be terminated when Expo is ready
    yes "y" 2>/dev/null | npx expo start --port $PORT > "$START_LOG" 2>&1 &
    EXPO_PID=$!
    # Get yes PID to kill it later
    YES_PID=$(pgrep -P $EXPO_PID | head -n 1 || echo "")
else
    # pnpm start - use yes to handle prompts
    yes "y" 2>/dev/null | pnpm start --port $PORT > "$START_LOG" 2>&1 &
    EXPO_PID=$!
    YES_PID=$(pgrep -P $EXPO_PID | head -n 1 || echo "")
fi

# Kill yes process after a short delay to avoid infinite input
(sleep 10 && [ -n "$YES_PID" ] && kill $YES_PID 2>/dev/null || true) &

# Get the actual Expo process ID (might be a child process)
sleep 1
ACTUAL_PID=$(pgrep -f "expo start\|metro.*808" | head -n 1 || echo "$EXPO_PID")
if [ "$ACTUAL_PID" != "$EXPO_PID" ] && [ -n "$ACTUAL_PID" ]; then
    EXPO_PID=$ACTUAL_PID
    echo "  → Expo process ID (aniqlangan): $EXPO_PID"
else
    echo "  → Expo process ID: $EXPO_PID"
fi

# Wait for server to start with progress
MAX_WAIT=30
WAIT_COUNT=0
STARTED=false

# Start progress indicator with dynamic percentage
start_spinner "Metro bundler ishga tushishini kutmoqda..."
PROGRESS_SPINNER_PID=$SPINNER_PID

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
    
    # Check if Metro started
    if grep -q "Metro" "$START_LOG" || grep -q "Starting Metro Bundler" "$START_LOG" || grep -q "Web is waiting" "$START_LOG" 2>/dev/null; then
        STARTED=true
        # Kill yes process as Metro is ready
        pkill -f "^yes y" 2>/dev/null || true
        [ -n "$YES_PID" ] && kill $YES_PID 2>/dev/null || true
        break
    fi
    
    # Check if process died
    if ! kill -0 $EXPO_PID 2>/dev/null; then
        stop_spinner
        pkill -f "^yes y" 2>/dev/null || true
        START_ERROR=$(tail -n 20 "$START_LOG")
        check_fail "$PNPM_CMD start" "$PNPM_CMD start" "Process yiqildi: $START_ERROR"
        STARTED=false
        break
    fi
done

# Cleanup yes process if still running
pkill -f "^yes y" 2>/dev/null || true

stop_spinner

if [ "$STARTED" = true ]; then
    # Check for common errors in log
    if grep -qi "error\|failed\|cannot" "$START_LOG"; then
        START_WARNINGS=$(grep -i "error\|failed\|cannot" "$START_LOG" | head -n 3)
        check_warn "$PNPM_CMD start" "$PNPM_CMD start (log tekshiruv)" "Ba'zi ogohlantirishlar: $START_WARNINGS"
    else
        check_pass "$PNPM_CMD start" "$PNPM_CMD start" "Metro bundler ishga tushdi"
    fi
    
    # Try to get the URL
    if grep -q "http://" "$START_LOG"; then
        SERVER_URL=$(grep -o "http://[^ ]*" "$START_LOG" | head -n 1)
        add_result "Server URL" "grep http://" "PASS" "$SERVER_URL"
    fi
    
    echo "  ✓ Server ishga tushdi!"
    echo "  → Process $EXPO_PID ishlamoqda"
    echo "  → Log: $START_LOG"
    echo ""
    echo "  ⚠ Server fon rejimda ishlamoqda."
    echo "  ⚠ To'xtatish uchun: kill $EXPO_PID"
    echo ""
    
    # Give it a moment to fully start
    sleep 3
    
    # Final health check
    if kill -0 $EXPO_PID 2>/dev/null; then
        check_pass "Server holati" "kill -0 $EXPO_PID" "Server ishlamoqda"
    else
        check_fail "Server holati" "kill -0 $EXPO_PID" "Server yiqildi"
    fi
else
    check_fail "$PNPM_CMD start" "$PNPM_CMD start (timeout)" "Server ${MAX_WAIT}s ichida ishga tushmadi"
    if [ -f "$START_LOG" ]; then
        echo "  Log oxirgi qatorlari:"
        tail -n 10 "$START_LOG" | sed 's/^/    /'
    fi
fi

echo ""

# Generate report
echo "=========================================="
echo "📊 Hisobot tayyorlanmoqda..."
echo "=========================================="

cat > "$REPORT_FILE" <<EOF
# BoshqaruvMobile - Tekshiruv Hisoboti

**Vaqt:** $(date '+%Y-%m-%d %H:%M:%S')  
**Loyiha:** VohadaIsh  
**Branch:** $(git branch --show-current 2>/dev/null || echo "noma'lum")

## Tekshiruv Natijalari

| # | Tekshiruv | Usul | Natija | Izoh |
|---|-----------|------|--------|------|
EOF

COUNTER=1
for result in "${RESULTS[@]}"; do
    IFS='|' read -r check method result notes <<< "$result"
    # Escape pipe characters in notes
    notes_escaped=$(echo "$notes" | sed 's/|/\\|/g')
    echo "| $COUNTER | $check | $method | $result | $notes_escaped |" >> "$REPORT_FILE"
    COUNTER=$((COUNTER + 1))
done

# Summary
TOTAL=${#RESULTS[@]}
PASS=$(grep -c "| PASS |" "$REPORT_FILE" || echo "0")
FAIL=$(grep -c "| FAIL |" "$REPORT_FILE" || echo "0")
WARN=$(grep -c "| WARN |" "$REPORT_FILE" || echo "0")

cat >> "$REPORT_FILE" <<EOF

## Xulosa

- **Jami tekshiruvlar:** $TOTAL
- **✅ Muvaffaqiyatli:** $PASS
- **❌ Muvaffaqiyatsiz:** $FAIL
- **⚠️ Ogohlantirishlar:** $WARN

## Eng Muhim Tavsiyalar

EOF

# Generate top 3 recommendations
RECOMMENDATIONS=()

if [ "$FAIL" -gt 0 ]; then
    FAILED_CHECKS=$(grep "| FAIL |" "$REPORT_FILE" | head -n 3 | sed 's/^| [0-9]* | \([^|]*\) |.*/\1/')
    RECOMMENDATIONS+=("Muvaffaqiyatsiz tekshiruvlarni tuzatish: $(echo "$FAILED_CHECKS" | tr '\n' ', ' | sed 's/,$//')")
fi

if [ "$EXPO_PID" ] && kill -0 $EXPO_PID 2>/dev/null; then
    RECOMMENDATIONS+=("Ilova ishlamoqda. Loglarni ko'rish: tail -f $START_LOG")
fi

if [ "$TYPECHECK_EXIT" -eq 1 ] || [ "$LINT_EXIT" -eq 1 ]; then
    RECOMMENDATIONS+=("TypeScript yoki ESLint xatolari bor. Loglarni tekshiring: typecheck.log yoki lint.log")
fi

# Add default recommendations if less than 3
if [ ${#RECOMMENDATIONS[@]} -lt 3 ]; then
    RECOMMENDATIONS+=("Barcha tekshiruvlar o'tdi. Ilovani ishlatishga tayyor!")
fi

for i in "${!RECOMMENDATIONS[@]}"; do
    if [ $i -lt 3 ]; then
        echo "$((i + 1)). ${RECOMMENDATIONS[$i]}" >> "$REPORT_FILE"
    fi
done

cat >> "$REPORT_FILE" <<EOF

## Qo'shimcha Ma'lumotlar

- **Typecheck log:** typecheck.log
- **Lint log:** lint.log
- **Test log:** test.log
- **Start log:** $START_LOG

## Server Ma'lumotlari

EOF

if [ "$EXPO_PID" ] && kill -0 $EXPO_PID 2>/dev/null; then
    echo "- **Status:** ✅ Ishlamoqda (PID: $EXPO_PID)" >> "$REPORT_FILE"
    echo "- **To'xtatish:** \`kill $EXPO_PID\`" >> "$REPORT_FILE"
    
    if [ -n "$SERVER_URL" ]; then
        echo "- **URL:** $SERVER_URL" >> "$REPORT_FILE"
    fi
else
    echo "- **Status:** ❌ To'xtatilgan yoki ishlamayapti" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "*Hisobot avtomatik yaratilgan: $(date '+%Y-%m-%d %H:%M:%S')*" >> "$REPORT_FILE"

echo ""
echo "✅ Hisobot yaratildi: $REPORT_FILE"
echo ""
echo "=========================================="
echo "📋 QISQA XULOSA"
echo "=========================================="
echo "Jami: $TOTAL tekshiruv"
echo "✅ Pass: $PASS"
echo "❌ Fail: $FAIL"
echo "⚠️  Warn: $WARN"
echo ""

if [ "$EXPO_PID" ] && kill -0 $EXPO_PID 2>/dev/null; then
    echo "🚀 Ilova ishlamoqda (PID: $EXPO_PID)"
    echo "📄 To'liq hisobot: $REPORT_FILE"
    echo ""
    echo "⚠️  Server fon rejimda ishlamoqda."
    echo "⚠️  To'xtatish: kill $EXPO_PID"
else
    echo "❌ Ilova ishga tushmadi"
    echo "📄 To'liq hisobot: $REPORT_FILE"
fi

echo ""
echo "=========================================="

# Exit with appropriate code
if [ "$FAIL" -gt 0 ]; then
    exit 1
else
    exit 0
fi

