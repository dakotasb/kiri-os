#!/usr/bin/env python3
"""
tiered_automatic_guardrails.py
Option A Automatic WITH Size Thresholds

Tiers:
- Tier 1 (Userland < 1MB): Fully automatic, no prompts
- Tier 2 (Framework 1MB-50MB): Automatic backup, approval prompt
- Tier 3 (Infrastructure > 50MB): Size-aware approval with "skip backup" option
- Tier 4 (Critical > 500MB): Mandatory approval, warn about constraints

Storage Thresholds:
- < 1MB: Safe zone
- 1-50MB: Acceptable
- 50-500MB: Warning
- > 500MB: Critical
"""

import os
import sys
import json
import shutil
from datetime import datetime
from pathlib import Path

# Storage thresholds in MB
THRESHOLDS = {
    'tier1_safe': 1,      # Full auto
    'tier2_acceptable': 50,  # Auto + notify
    'tier3_warning': 500,    # Mandatory approval
}

# Tier classification
TIERS = {
    'userland': ['skill', 'agent_config', 'cron_job'],
    'framework': ['native_skill', 'mempalace_config'],
    'infrastructure': ['neo4j', 'docker', 'system'],
}

def get_free_space_gb(path='~'):
    """Get free space in GB for given path."""
    expanded = os.path.expanduser(path)
    usage = shutil.disk_usage(expanded)
    free_gb = usage.free / (1024**3)
    return free_gb

def classify_tier(resource_type):
    """Classify resource into tier."""
    if resource_type in TIERS['userland']:
        return 'tier1'
    elif resource_type in TIERS['framework']:
        return 'tier2'
    elif resource_type in TIERS['infrastructure']:
        return 'tier3'
    else:
        return 'tier2'  # Default to framework level

def estimate_size(resource_type, resource_name):
    """Estimate backup size in MB."""
    size_estimates = {
        'skill': 0.01,  # 10KB average
        'agent_config': 0.001,  # 1KB
        'cron_job': 0.001,  # 1KB
        'native_skill': 0.01,  # 10KB
        'mempalace_config': 0.1,  # 100KB
        'neo4j': 70,  # 70MB minimum
        'docker': 100,  # 100MB+
        'system': 50,  # 50MB+
    }
    return size_estimates.get(resource_type, 10)  # Default 10MB

def check_storage_health(threshold_gb=10):
    """Check if critical storage is healthy."""
    warnings = []
    
    # Check common locations
    locations = ['~', '/tmp', '/var']
    
    for loc in locations:
        try:
            free = get_free_space_gb(loc)
            if free < threshold_gb:
                warnings.append(f"⚠️  {loc}: Only {free:.1f}GB free (below {threshold_gb}GB threshold)")
        except:
            pass
    
    return warnings

def prompt_user_decision(resource_type, resource_name, estimated_mb, free_space_gb):
    """Generate user prompt for approval decisions."""
    
    tier = classify_tier(resource_type)
    
    print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 TIERED AUTOMATIC GUARDRAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Resource: {resource_type}/{resource_name}
Tier: {tier}
Estimated backup size: {estimated_mb:.2f} MB
Current free space: {free_space_gb:.1f} GB

""")
    
    # Tier 1: Auto-approve
    if tier == 'tier1' and estimated_mb < THRESHOLDS['tier1_safe']:
        print("✅ TIER 1 (Userland): Automatic approval (size < 1MB)")
        return 'auto_approve'
    
    # Tier 2: Framework operations
    if tier == 'tier2' and estimated_mb < THRESHOLDS['tier2_acceptable']:
        print("⚠️  TIER 2 (Framework): Automatic backup + proceed")
        print(f"   Backup size acceptable ({estimated_mb:.2f}MB < {THRESHOLDS['tier2_acceptable']}MB)")
        return 'auto_backup'
    
    # Tier 3: Infrastructure or large operations
    print("⚠️  TIER 3 (Infrastructure/Large Operation)")
    print(f"   Size: {estimated_mb:.2f}MB")
    
    if estimated_mb > THRESHOLDS['tier3_warning']:
        print(f"   🔴 WARNING: Operation size > {THRESHOLDS['tier3_warning']}MB")
    
    print(f"""
Storage check:
- Free space available: {free_space_gb:.1f} GB
- Estimated operation: {estimated_mb:.2f} MB
- Safe to proceed: {'✅ Yes' if estimated_mb < free_space_gb * 1024 else '⚠️  Caution'}

OPTIONS:
[Y]   Create backup and proceed (recommended)
[n]   Cancel operation
[s]   Skip backup and proceed (faster, no storage used)
[v]   View size details first
""")
    
    return 'requires_approval'

def validate_before_modify(resource_type, resource_name, action='modify'):
    """Main validation entry point."""
    
    print(f"🔍 Pre-Modification Validation: {resource_type}/{resource_name}")
    print(f"Action: {action}")
    print(f"Time: {datetime.now().isoformat()}")
    print()
    
    # Get storage info
    free_space_gb = get_free_space_gb('~')
    estimated_mb = estimate_size(resource_type, resource_name)
    tier = classify_tier(resource_type)
    
    # Check storage health
    storage_warnings = check_storage_health()
    if storage_warnings:
        print("⚠️  STORAGE WARNINGS:")
        for warning in storage_warnings:
            print(f"   {warning}")
        print()
    
    # Decision logic
    decision = prompt_user_decision(resource_type, resource_name, estimated_mb, free_space_gb)
    
    result = {
        'resource_type': resource_type,
        'resource_name': resource_name,
        'action': action,
        'tier': tier,
        'estimated_size_mb': estimated_mb,
        'free_space_gb': free_space_gb,
        'decision': decision,
        'storage_warnings': storage_warnings,
        'timestamp': datetime.now().isoformat(),
    }
    
    # Log decision
    log_file = Path('~/.hermes/logs/tiered_guardrail_decisions.jsonl').expanduser()
    log_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(log_file, 'a') as f:
        f.write(json.dumps(result) + '\n')
    
    return result

def main():
    """CLI entry point."""
    if len(sys.argv) < 3:
        print("Usage: tiered_automatic_guardrails.py <resource_type> <resource_name> [action]")
        print()
        print("Examples:")
        print("  tiered_automatic_guardrails.py skill my-new-skill create")
        print("  tiered_automatic_guardrails.py neo4j mempalace backup")
        sys.exit(1)
    
    resource_type = sys.argv[1]
    resource_name = sys.argv[2]
    action = sys.argv[3] if len(sys.argv) > 3 else 'modify'
    
    result = validate_before_modify(resource_type, resource_name, action)
    
    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"Decision: {result['decision']}")
    print(f"Log: ~/.hermes/logs/tiered_guardrail_decisions.jsonl")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    if result['decision'] == 'requires_approval':
        # In real implementation, this would wait for user input
        # For now, print what would happen
        print()
        print("Waiting for user approval...")
        print("(In automatic mode, default: 'Y' if space available)")

if __name__ == '__main__':
    main()