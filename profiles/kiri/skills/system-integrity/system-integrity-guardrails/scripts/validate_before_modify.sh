
#!/bin/bash
# validate_before_modify.sh
# Run before allowing any agent to modify system state

set -e

RESOURCE_TYPE="$1"  # skill, palace, agent, cron
RESOURCE_NAME="$2"
ACTION="$3"        # create, update, delete

echo "🔍 Pre-Modification Validation"
echo "Resource: $RESOURCE_TYPE/$RESOURCE_NAME"
echo "Action: $ACTION"
echo "Timestamp: $(date)"
echo ""

# Step 1: Classify tier
case "$RESOURCE_TYPE" in
  "skill")
    if [[ "$RESOURCE_NAME" =~ ^(mempalace|cronjob|terminal|delegate|system-) ]]; then
      TIER="TIER_2_FRAMEWORK"
      echo "⚠️  TIER 2: Framework skill - requires validation"
    else
      TIER="TIER_1_USERLAND"
      echo "✅ TIER 1: Userland skill - standard safeguards"
    fi
    ;;
  "palace")
    TIER="TIER_2_FRAMEWORK"
    echo "⚠️  TIER 2: MemPalace modification"
    ;;
  "agent")
    TIER="TIER_1_USERLAND"
    echo "✅ TIER 1: Agent definition"
    ;;
  "cron")
    TIER="TIER_2_FRAMEWORK"
    echo "⚠️  TIER 2: Scheduled job"
    ;;
  *)
    TIER="TIER_3_INFRASTRUCTURE"
    echo "❌ TIER 3: Infrastructure - agent modification BLOCKED"
    exit 1
    ;;
esac

echo ""
echo "Tier: $TIER"
echo ""

# Step 2: Create backup
echo "📦 Creating backup..."
BACKUP_DIR="$HOME/.hermes/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

case "$RESOURCE_TYPE" in
  "skill")
    if [ -d "$HOME/.hermes/skills/$RESOURCE_NAME" ]; then
      cp -r "$HOME/.hermes/skills/$RESOURCE_NAME" "$BACKUP_DIR/"
      echo "✅ Skill backup: $BACKUP_DIR/$RESOURCE_NAME"
    fi
    ;;
  "palace")
    cd ~/mempalace 2>/dev/null || true
    docker exec mempalace-neo4j neo4j-admin dump --to=/data/backup_pre_${RESOURCE_NAME}_$(date +%s).db 2>/dev/null || echo "⚠️  Palace backup requires manual execution"
    ;;
esac

echo ""
echo "Backup location: $BACKUP_DIR"
echo ""

# Step 3: Generate validation checklist
echo "✅ Pre-Modification Checklist:"
echo ""

if [ "$TIER" = "TIER_2_FRAMEWORK" ] || [ "$TIER" = "TIER_3_INFRASTRUCTURE" ]; then
  echo "☐ User explicitly approved this modification"
  echo "☐ Modification purpose documented"
  echo "☐ Rollback procedure identified"
  echo "☐ Validation tests defined"
  echo "☐ Impact assessment complete (what else breaks?)"
else
  echo "☐ Basic functionality preserved"
  echo "☐ No syntax errors introduced"
fi

echo ""
echo "⚠️  CRITICAL: Review checklist before proceeding"
echo "📝 Log this modification in MemPalace diary"
echo ""
echo "Validation complete. Manual approval required for TIER 2/3."
