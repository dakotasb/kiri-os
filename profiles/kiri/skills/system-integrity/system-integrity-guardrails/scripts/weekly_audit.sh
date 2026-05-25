#!/bin/bash
# weekly_audit.sh
# Scheduled automatic integrity check
# Run via: cronjob action

echo "🔍 Weekly System Integrity Audit"
echo "================================"
echo "Timestamp: $(date)"
echo ""

ISSUES_FOUND=0

# Check 1: Skill integrity
echo "✅ Checking skill integrity..."
for skill_dir in ~/.hermes/skills/*/*/; do
  skill_name=$(basename "$skill_dir")
  if [ ! -f "$skill_dir/SKILL.md" ]; then
      echo "  ❌ $skill_name: Missing SKILL.md"
      ((ISSUES_FOUND++))
  fi
  # Check for syntax in frontmatter
  if ! grep -q "^---" "$skill_dir/SKILL.md" 2>/dev/null; then
      echo "  ⚠️  $skill_name: Missing frontmatter"
      ((ISSUES_FOUND++))
  fi
done

# Check 2: MemPalace connectivity
echo "✅ Checking MemPalace connectivity..."
if ! curl -s http://localhost:6333/healthz >/dev/null 2>&1; then
  echo "  ⚠️  Qdrant health check failed"
  ((ISSUES_FOUND++))
fi

# Check 3: Knowledge Graph integrity
echo "✅ Checking Knowledge Graph..."
KG_COUNT=$(docker exec mempalace-server node -e "
  const { Neo4jGraph } = require('./src/neo4jGraph.js');
  const graph = new Neo4jGraph();
  graph.graphStats().then(s => console.log(s.triples));
" 2>/dev/null || echo "0")

if [ "$KG_COUNT" -lt 1 ]; then
  echo "  ⚠️  Knowledge Graph appears empty or unreachable"
  ((ISSUES_FOUND++))
fi

# Check 4: Active cron jobs
echo "✅ Checking active cron jobs..."
cronjob list --format=json 2>/dev/null | jq -r '.jobs[] | select(.status == "failed") | .name' | while read failed_job; do
  if [ ! -z "$failed_job" ]; then
    echo "  ❌ Failed cron job: $failed_job"
    ((ISSUES_FOUND++))
  fi
done

# Check 5: Disk space
echo "✅ Checking disk space..."
DF_USAGE=$(df ~/.hermes | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DF_USAGE" -gt 80 ]; then
  echo "  ⚠️  Disk usage at ${DF_USAGE}%"
  ((ISSUES_FOUND++))
fi

echo ""
echo "=========================================="
if [ $ISSUES_FOUND -eq 0 ]; then
  echo "✅ AUDIT PASSED: No integrity issues found"
  exit 0
else
  echo "❌ AUDIT FAILED: $ISSUES_FOUND issue(s) found"
  echo "Review output above for details"
  exit 1
fi