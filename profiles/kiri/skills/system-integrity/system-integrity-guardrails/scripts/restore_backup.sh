
#!/bin/bash
# restore_backup.sh
# Emergency rollback procedure

RESOURCE_TYPE="$1"
RESOURCE_NAME="$2"

echo "🚨 EMERGENCY ROLLBACK"
echo "Resource: $RESOURCE_TYPE/$RESOURCE_NAME"
echo ""

# Find most recent backup
BACKUP_DIR="$HOME/.hermes/backups"
LATEST_BACKUP=$(ls -td "$BACKUP_DIR"/*/ 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "❌ No backups found!"
  echo "Manual recovery required."
  exit 1
fi

echo "Latest backup: $LATEST_BACKUP"
echo ""

case "$RESOURCE_TYPE" in
  "skill")
    if [ -d "$LATEST_BACKUP/$RESOURCE_NAME" ]; then
      rm -rf "$HOME/.hermes/skills/$RESOURCE_NAME"
      cp -r "$LATEST_BACKUP/$RESOURCE_NAME" "$HOME/.hermes/skills/"
      echo "✅ Skill restored from backup"
    else
      echo "❌ Skill not found in backup"
      exit 1
    fi
    ;;
  *)
    echo "⚠️  Rollback for $RESOURCE_TYPE requires manual intervention"
    echo "Check: $LATEST_BACKUP"
    ;;
esac

echo ""
echo "Rollback complete. Verify functionality."
