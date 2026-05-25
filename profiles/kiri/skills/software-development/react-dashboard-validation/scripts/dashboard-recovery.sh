#!/bin/bash
# Dashboard Recovery Template Script
# Usage: ./dashboard-recovery.sh /path/to/dashboard [PORT]

DASHBOARD_PATH=${1:-~/command_center/kirimvp_orchestration/phase3_build/dashboard}
PORT=${2:-3001}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "=== Dashboard Recovery Script ==="
echo "Path: $DASHBOARD_PATH"
echo "Port: $PORT"
echo ""

# Step 1: Clear processes on port
echo "Step 1: Clearing port $PORT..."
pkill -9 -f "next.*$PORT" 2>/dev/null
lsof -i:$PORT -t 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2
if lsof -i:$PORT >/dev/null 2>&1; then
    echo -e "${RED}Port $PORT still in use!${NC}"
    exit 1
else
    echo -e "${GREEN}Port $PORT cleared${NC}"
fi

# Step 2: Verify critical files
echo ""
echo "Step 2: Checking critical files..."
CRITICAL_FILES=("package.json" "src/app/(dashboard)/page.tsx" "src/data/agents.ts")
MISSING=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$DASHBOARD_PATH/$file" ]; then
        echo -e "${RED}MISSING: $file${NC}"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "Finding backup..."
    # Add backup discovery logic here
fi

# Step 3: Clear cache
echo ""
echo "Step 3: Clearing build cache..."
rm -rf "$DASHBOARD_PATH/.next" "$DASHBOARD_PATH/dev" "$DASHBOARD_PATH/dist" 2>/dev/null
echo -e "${GREEN}Cache cleared${NC}"

# Step 4: Start server
echo ""
echo "Step 4: Starting server on port $PORT..."
cd "$DASHBOARD_PATH" && PORT=$PORT npm run dev &

# Step 5: Verify
echo ""
echo "Step 5: Waiting 30s for startup..."
sleep 30

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/dashboard)
if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}SUCCESS: Dashboard running on http://localhost:$PORT/dashboard${NC}"
else
    echo -e "${RED}FAILED: HTTP $HTTP_STATUS${NC}"
    echo "Check logs for errors"
fi
