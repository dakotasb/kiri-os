#!/usr/bin/env python3
"""
Agent Health Auditor - audit_all_agents

Validates all agent manifests for structural integrity,
model configuration correctness, and operational readiness.
"""

import json
from pathlib import Path
from typing import Dict, List, Any

AGENT_DIR = Path.home() / "command_center" / "agents"


def validate_manifest_structure(manifest: Dict) -> List[str]:
    """Validate manifest has correct structure. Returns list of errors."""
    errors = []
    
    # Check agent key exists and is dict
    if "agent" not in manifest:
        errors.append("Missing 'agent' key")
    elif not isinstance(manifest["agent"], dict):
        errors.append(f"'agent' key is {type(manifest['agent']).__name__}, expected dict")
    else:
        agent = manifest["agent"]
        if "id" not in agent:
            errors.append("agent.id missing")
        if "name" not in agent:
            errors.append("agent.name missing")
        if "role" not in agent:
            errors.append("agent.role missing")
    
    # Check identity
    if "identity" not in manifest:
        errors.append("Missing 'identity' key")
    elif not isinstance(manifest["identity"], dict):
        errors.append("identity is not a dict")
    elif "prompt" not in manifest.get("identity", {}):
        errors.append("identity.prompt missing")
    
    # Check models
    if "models" not in manifest:
        errors.append("Missing 'models' key")
    else:
        models = manifest["models"]
        if "primary" not in models:
            errors.append("models.primary missing")
        if "task_mapping" not in models:
            errors.append("models.task_mapping missing")
    
    # Check focus
    if "focus" not in manifest:
        errors.append("Missing 'focus' key")
    
    # Check dependencies (optional but recommended)
    if "dependencies" not in manifest:
        errors.append("WARNING: dependencies missing (collaboration matrix)")
    
    return errors


def check_model_validity(models: Dict) -> List[str]:
    """Check model configuration for validity."""
    errors = []
    task_mapping = models.get("task_mapping", {})
    
    # Common valid models
    valid_models = [
        "kimi-k2.5", "deepseek-r1", "llama-3.2-90b",
        "claude-3.5-sonnet", "qwen3.5"
    ]
    
    for task, model in task_mapping.items():
        if model not in valid_models:
            errors.append(f"task_mapping['{task}'] = '{model}' (unknown model)")
    
    return errors


def audit_agent(agent_name: str) -> Dict[str, Any]:
    """Audit a single agent manifest."""
    manifest_path = AGENT_DIR / agent_name / "manifest.json"
    
    if not manifest_path.exists():
        return {
            "agent": agent_name,
            "status": "MISSING",
            "errors": ["Manifest file not found"]
        }
    
    try:
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)
    except json.JSONDecodeError as e:
        return {
            "agent": agent_name,
            "status": "BROKEN_JSON",
            "errors": [f"Invalid JSON: {str(e)}"]
        }
    except Exception as e:
        return {
            "agent": agent_name,
            "status": "ERROR",
            "errors": [str(e)]
        }
    
    # Run validation
    structure_errors = validate_manifest_structure(manifest)
    model_errors = []
    if "models" in manifest:
        model_errors = check_model_validity(manifest["models"])
    
    all_errors = structure_errors + model_errors
    
    # Extract key info for healthy agents
    agent_info = {
        "agent": agent_name,
        "status": "HEALTHY" if not all_errors else "ISSUES",
        "id": manifest.get("agent", {}).get("id", "N/A"),
        "name": manifest.get("agent", {}).get("name", "Unknown"),
        "role": manifest.get("agent", {}).get("role", "N/A"),
        "primary_model": manifest.get("models", {}).get("primary", "N/A"),
        "task_types": len(manifest.get("models", {}).get("task_mapping", {})),
        "errors": all_errors if all_errors else None
    }
    
    return agent_info


def audit_all_agents() -> Dict[str, Any]:
    """Audit all agents in the fleet."""
    if not AGENT_DIR.exists():
        return {"error": f"Agent directory not found: {AGENT_DIR}"}
    
    results = {
        "summary": {
            "total": 0,
            "healthy": 0,
            "issues": 0,
            "missing": 0
        },
        "agents": {}
    }
    
    for agent_dir in AGENT_DIR.iterdir():
        if agent_dir.is_dir():
            agent_name = agent_dir.name
            audit_result = audit_agent(agent_name)
            results["agents"][agent_name] = audit_result
            results["summary"]["total"] += 1
            
            if audit_result["status"] == "HEALTHY":
                results["summary"]["healthy"] += 1
            elif audit_result["status"] in ["MISSING", "ERROR", "BROKEN_JSON"]:
                results["summary"]["missing"] += 1
            else:
                results["summary"]["issues"] += 1
    
    return results


if __name__ == "__main__":
    import sys
    results = audit_all_agents()
    print(json.dumps(results, indent=2))
    
    # Exit with error code if there are issues
    if results["summary"]["issues"] > 0 or results["summary"]["missing"] > 0:
        sys.exit(1)
