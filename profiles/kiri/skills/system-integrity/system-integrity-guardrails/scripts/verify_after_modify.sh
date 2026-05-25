
#!/bin/bash
# verify_after_modify.sh
# Run after agent completes modification

set -e

RESOURCE_TYPE="$1"
RESOURCE_NAME="$2"

echo "🔍 Post-Modification Verification"
echo "Resource: $RESOURCE_TYPE/$RESOURCE_NAME"
echo "Timestamp: $(date)"
echo ""

PASSED=0
FAILED=0

# Test 1: Resource loads
echo "Test 1: Resource loads without error..."
case "$RESOURCE_TYPE" in
  "skill")
    if skill_view "$RESOURCE_NAME" >/dev/null 2>&1; then
      echo "✅ PASS: Skill loads"
      ((PASSED++))
    else
      echo "❌ FAIL: Skill broken"
      ((FAILED++))
    fi
    ;;
  "palace")
    if mempalace_search("test", palace="$RESOURCE_NAME") >/dev/null 2>&1; then
      echo "✅ PASS: Palace accessible"
      ((PASSED++))
    else
      echo "❌ FAIL: Palace broken"
      ((FAILED++))
    fi
    ;;
esac

# Test 2: No cascade failures
echo ""
echo "Test 2: No cascade failures detected..."
# Check for common failure patterns

# Check for skill loading errors in recent logs
if grep -q "skill.*error\|skill.*fail" ~/.hermes/logs/*.log 2>/dev/null; then
  echo "❌ FAIL: Skill errors detected in logs"
  ((FAILED++))
else
  echo "✅ PASS: No skill errors"
  ((PASSED++))
fi

# Test 3: MemPalace responsive
echo ""
echo "Test 3: MemPalace responsive..."
if mempalace_status >/dev/null 2>&1; then
  echo "✅ PASS: MemPalace operational"
  ((PASSED++))
else
  echo "❌ FAIL: MemPalace issue detected"
  ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Results: $PASSED passed, $FAILED failed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "⚠️  VERIFICATION FAILED"
  echo "Consider rollback:"
  echo "  restore_backup.sh $RESOURCE_TYPE $RESOURCE_NAME"
  echo ""
  exit 1
else
  echo ""
  echo "✅ VERIFICATION PASSED"
  echo "Modification successful. Document in diary."
  echo ""
  exit 0
fi
