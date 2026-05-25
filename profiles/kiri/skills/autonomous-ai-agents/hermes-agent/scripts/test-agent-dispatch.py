#!/usr/bin/env python3
"""
Agent Dispatch Troubleshooting Script
Tests dispatch for all agents and identifies auth/config issues.
"""

import subprocess
import re
from pathlib import Path

def test_agent_dispatch(agent_name, api_key):
    """Test if an agent can be dispatched."""
    cmd = f'''export OLLAMA_API_KEY="{api_key}" && hermes -p {agent_name} chat -q "Test dispatch" -Q 2>&1'''
    
    result = subprocess.run(
        ['bash', '-c', cmd],
        capture_output=True, text=True,
        timeout=30
    )
    
    output = result.stdout.strip()
    
    if "Error: unauthorized" in output:
        return "FAILED", "unauthorized"
    elif "No inference provider" in output:
        return "FAILED", "no_provider"
    elif "session_id:" in output and "Error" not in output:
        return "SUCCESS", output.split("session_id:")[-1].strip()[:20]
    elif "Error:" in output:
        return "FAILED", output.split("Error:")[-1].strip()[:50]
    else:
        return "UNKNOWN", output[:50]

def check_config_structure(agent_name):
    """Verify config.yaml has correct nested structure."""
    config_path = Path.home() / f".hermes/profiles/{agent_name}/config.yaml"
    
    if not config_path.exists():
        return "MISSING", "config.yaml not found"
    
    content = config_path.read_text()
    
    # Check for nested model structure
    if re.search(r'^model:\s*$', content, re.MULTILINE):
        if re.search(r'^  (provider:|model:|base_url:|api_key:)', content, re.MULTILINE):
            return "OK", "nested structure"
    
    # Check for flat structure (wrong)
    if re.search(r'^model:\s+\S', content, re.MULTILINE):
        return "WRONG", "flat structure - needs nesting under model:"
    
    return "UNKNOWN", "unable to parse"

def main():
    import os
    
    api_key = os.environ.get("OLLAMA_API_KEY", "")
    if not api_key:
        print("ERROR: OLLAMA_API_KEY not set in environment")
        print("Run: export OLLAMA_API_KEY='your-key'")
        return 1
    
    profiles_dir = Path.home() / ".hermes/profiles"
    agents = sorted([p.name for p in profiles_dir.iterdir() if p.is_dir()])
    
    print("Agent Dispatch Test Results")
    print("=" * 70)
    print(f"Testing {len(agents)} agents with API key: {api_key[:10]}...")
    print()
    
    results = {
        "SUCCESS": [],
        "FAILED": [],
        "UNKNOWN": []
    }
    
    for agent in agents:
        # Check config first
        config_status, config_msg = check_config_structure(agent)
        
        if config_status == "MISSING":
            results["FAILED"].append((agent, f"Missing config: {config_msg}"))
            print(f"❌ {agent:15} {config_msg}")
            continue
        
        if config_status == "WRONG":
            results["FAILED"].append((agent, f"Config structure: {config_msg}"))
            print(f"❌ {agent:15} {config_msg}")
            continue
        
        # Test dispatch
        status, details = test_agent_dispatch(agent, api_key)
        results[status].append((agent, details))
        
        icon = "✅" if status == "SUCCESS" else "❌" if status == "FAILED" else "❓"
        print(f"{icon} {agent:15} {status:10} {details[:30]}")
    
    print()
    print("=" * 70)
    print(f"Summary: {len(results['SUCCESS'])} working, {len(results['FAILED'])} failed, {len(results['UNKNOWN'])} unknown")
    
    if results['FAILED']:
        print("\nFailed agents:")
        for agent, reason in results['FAILED']:
            print(f"  - {agent}: {reason}")
    
    return 0 if len(results['SUCCESS']) == len(agents) else 1

if __name__ == "__main__":
    exit(main())
