#!/usr/bin/env python3
"""
Agent Dispatch System

Dispatch agent tasks to appropriate models based on manifest configuration.

Usage:
    python dispatch.py --agent Keystone --task code_review --context "Review PR #123"
    python dispatch.py --agent Mason --task arch --schedule "0 2 * * *"
    python dispatch.py --list-agents
    python dispatch.py --agent Keystone --show-manifest
"""

import json
import sys
import os
from pathlib import Path
from typing import Optional, Dict, Any

# Base paths
AGENT_DIR = Path.home() / "command_center" / "agents"
ARTEFACT_DIR = Path.home() / "command_center" / "artefacts"


def load_manifest(agent_name: str) -> Dict[str, Any]:
    """Load agent manifest from filesystem."""
    manifest_path = AGENT_DIR / agent_name / "manifest.json"
    
    if not manifest_path.exists():
        raise FileNotFoundError(f"Agent manifest not found: {manifest_path}")
    
    with open(manifest_path, 'r') as f:
        return json.load(f)


def select_model(manifest: Dict, task_type: str) -> str:
    """Select appropriate model for task type from manifest."""
    models = manifest.get("models", {})
    task_mapping = models.get("task_mapping", {})
    primary = models.get("primary", "kimi-k2.5")
    
    # Try task-specific mapping first
    if task_type in task_mapping:
        return task_mapping[task_type]
    
    # Fall back to primary model
    return primary


def build_prompt(manifest: Dict, task_type: str, context: str) -> str:
    """Build dispatch prompt from manifest identity + task context."""
    agent_name = manifest.get("agent", {}).get("name", "Unknown")
    agent_role = manifest.get("agent", {}).get("role", "Agent")
    identity_prompt = manifest.get("identity", {}).get("prompt", f"You are {agent_name}")
    
    prompt = f"""{identity_prompt}

TASK: {task_type}
CONTEXT: {context}

Execute this task according to your role and specialties.
"""
    return prompt


def dispatch_agent(agent_name: str, task_type: str, context: str,
                   schedule: str = "now", deliver: str = "origin") -> Dict:
    """
    Dispatch agent task to appropriate model.
    
    This is the CORE function that routes tasks to models.
    It performs NO actual execution - it creates a cron job that will
    run independently with the selected model.
    
    Args:
        agent_name: Name of agent (e.g., "Keystone", "Mason")
        task_type: Type of task (e.g., "code_review", "arch", "coding")
        context: Task context/prompt
        schedule: Cron schedule (default: "now" for immediate)
        deliver: Where to deliver results (default: "origin" for Discord)
    
    Returns:
        Dict with dispatch info: { "agent", "task", "model", "job_id" }
    """
    # 1. Load manifest
    manifest = load_manifest(agent_name)
    
    # 2. Select model based on task type
    selected_model = select_model(manifest, task_type)
    
    # 3. Build prompt
    prompt = build_prompt(manifest, task_type, context)
    
    # 4. Prepare output paths
    timestamp = os.popen('date +%Y%m%d_%H%M%S').read().strip()
    output_file = ARTEFACT_DIR / agent_name.lower() / f"{task_type}_{timestamp}.md"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # 5. Enhanced prompt with output instructions
    full_prompt = f"""{prompt}

OUTPUT REQUIREMENTS:
- Save detailed results to: {output_file}
- Include timestamp and task type in output
- If this is a multi-phase task, note completion status
- Return a summary of actions taken
"""
    
    return {
        "agent": agent_name,
        "task": task_type,
        "model": selected_model,
        "prompt": full_prompt,
        "schedule": schedule,
        "deliver": deliver,
        "output_file": str(output_file),
        "manifest_loaded": True
    }


def list_agents() -> Dict[str, Any]:
    """List all available agents and their model configurations."""
    agents = {}
    
    if not AGENT_DIR.exists():
        return {"error": f"Agent directory not found: {AGENT_DIR}"}
    
    for agent_dir in AGENT_DIR.iterdir():
        if agent_dir.is_dir():
            manifest_path = agent_dir / "manifest.json"
            if manifest_path.exists():
                try:
                    with open(manifest_path, 'r') as f:
                        manifest = json.load(f)
                    
                    agents[agent_dir.name] = {
                        "name": manifest.get("agent", {}).get("name", agent_dir.name),
                        "role": manifest.get("agent", {}).get("role", "Unknown"),
                        "primary_model": manifest.get("models", {}).get("primary", "N/A"),
                        "task_types": list(manifest.get("models", {}).get("task_mapping", {}).keys()),
                        "status": manifest.get("status", "unknown")
                    }
                except Exception as e:
                    agents[agent_dir.name] = {"error": str(e)}
    
    return agents


def show_manifest(agent_name: str) -> Dict[str, Any]:
    """Display full manifest for an agent."""
    try:
        manifest = load_manifest(agent_name)
        return {
            "agent": manifest.get("agent"),
            "models": manifest.get("models"),
            "focus": manifest.get("focus"),
            "responsibilities": manifest.get("responsibilities", [])[:5]  # First 5
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Agent Dispatch System")
    parser.add_argument("--agent", help="Agent name to dispatch")
    parser.add_argument("--task", help="Task type (e.g., code_review, arch)")
    parser.add_argument("--context", default="Execute your role.", help="Task context")
    parser.add_argument("--schedule", default="now", help="Cron schedule (now for immediate)")
    parser.add_argument("--list-agents", action="store_true", help="List all available agents")
    parser.add_argument("--show-manifest", action="store_true", help="Show agent manifest")
    parser.add_argument("--audit", action="store_true", help="Audit all agents for health")
    parser.add_argument("--repair", action="store_true", help="Repair specific agent (use with --agent)")
    
    args = parser.parse_args()
    
    if args.audit:
        # Run health audit on all agents
        from audit_agents import audit_all_agents
        results = audit_all_agents()
        import json
        print(json.dumps(results, indent=2))
        sys.exit(0)
    
    if args.repair and args.agent:
        # Repair specific agent
        from repair_manifest import repair_agent
        result = repair_agent(args.agent)
        print(json.dumps(result, indent=2))
        sys.exit(0)
    
    if args.list_agents:
        import json
        agents = list_agents()
        print(json.dumps(agents, indent=2))
        sys.exit(0)
    
    if args.show_manifest and args.agent:
        import json
        manifest = show_manifest(args.agent)
        print(json.dumps(manifest, indent=2))
        sys.exit(0)
    
    if not args.agent or not args.task:
        parser.print_help()
        sys.exit(1)
    
    # Run dispatch
    try:
        result = dispatch_agent(
            agent_name=args.agent,
            task_type=args.task,
            context=args.context,
            schedule=args.schedule
        )
        
        import json
        print(json.dumps(result, indent=2))
        
        print(f"\n{'='*60}")
        print("DISPATCH READY")
        print(f"{'='*60}")
        print(f"To spawn this agent, run:")
        print("  hermes cron create \\")
        cmd_name = f"{args.agent.lower()}-{args.task}"
        cmd_model = result["model"]
        cmd_schedule = result["schedule"]
        print(f'    --name "{cmd_name}" \\')
        print(f'    --prompt "..." \\')
        print(f'    --model "{cmd_model}" \\')
        print(f'    --schedule "{cmd_schedule}"')
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
