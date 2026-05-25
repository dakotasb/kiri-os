#!/usr/bin/env python3
"""
Agent Model Config Validator

Validates all agent manifests against available models from Ollama Cloud.
Usage: python validate_models.py
"""

import json
import subprocess
from pathlib import Path
from typing import Set, Dict, List

def get_available_models() -> Set[str]:
    """Fetch actual available models from Ollama Cloud."""
    try:
        result = subprocess.run(
            ['curl', '-s', 'https://ollama.com/v1/models',
             '-H', 'Authorization: Bearer $OLLAMA_API_KEY'],
            capture_output=True, text=True, timeout=30
        )
        data = json.loads(result.stdout)
        return {m['id'] for m in data.get('data', [])}
    except Exception as e:
        print(f"Error fetching models: {e}")
        return set()

def validate_manifests(available: Set[str]) -> List[Dict]:
    """Find invalid model references in all agent manifests."""
    agent_dir = Path.home() / "command_center" / "agents"
    issues = []
    
    for manifest_file in agent_dir.glob("*/manifest.json"):
        agent_name = manifest_file.parent.name
        try:
            with open(manifest_file) as f:
                data = json.load(f)
            
            models = data.get("models", {})
            all_refs = [
                models.get("primary"),
                *models.get("fallback", []),
                *models.get("task_mapping", {}).values()
            ]
            
            for model in all_refs:
                if model and model not in available:
                    issues.append({
                        "agent": agent_name,
                        "model": model,
                        "type": "primary" if model == models.get("primary") else "reference"
                    })
        except Exception as e:
            issues.append({"agent": agent_name, "error": str(e)})
    
    return issues

def main():
    print("🔍 Fetching available models from Ollama Cloud...")
    available = get_available_models()
    
    if not available:
        print("❌ Could not fetch available models. Check $OLLAMA_API_KEY")
        return 1
    
    print(f"✅ Found {len(available)} available models")
    print("📋 Validating agent manifests...")
    
    issues = validate_manifests(available)
    
    if issues:
        print(f"\n❌ Found {len(issues)} invalid references:")
        for issue in issues[:20]:
            if "error" in issue:
                print(f"  - {issue['agent']}: ERROR - {issue['error']}")
            else:
                print(f"  - {issue['agent']}: {issue['model']} ({issue['type']})")
        return 1
    else:
        print("\n✅ All model references valid!")
        print(f"   Verified {len(list((Path.home() / 'command_center' / 'agents').glob('*/manifest.json')))} agent manifests")
        return 0

if __name__ == "__main__":
    exit(main())
