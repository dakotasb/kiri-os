#!/usr/bin/env python3
"""
Codex Multi-Agent System Analyzer - Browser Edition

Uses browser navigation to deeply study multi-agent orchestration systems.
"""

import json
import os
import subprocess
from pathlib import Path
from typing import Dict, List

BASE_DIR = Path.home() / "command_center"
KNOWLEDGE_DIR = BASE_DIR / "knowledge" / "codex"

# Get model from environment or config
def get_current_model() -> str:
    """Detect which model is actually being used for this execution."""
    import os
    # Check for model in environment (Hermes might set this)
    env_model = os.environ.get('HERMES_MODEL') or os.environ.get('MODEL_NAME')
    if env_model:
        return env_model
    
    # Check config.yaml default
    import yaml
    config_path = Path.home() / '.hermes' / 'config.yaml'
    if config_path.exists():
        try:
            with open(config_path) as f:
                config = yaml.safe_load(f)
                return config.get('model', {}).get('default', 'unknown')
        except Exception:
            pass
    
    return 'unknown'

# Log model at startup
CURRENT_MODEL = get_current_model()
print(f"[CODEX] Running with model: {CURRENT_MODEL}")

def analyze_multi_agent_readme(repo_full_name: str) -> Dict:
    """
    Fetch and analyze README from GitHub repository.
    Uses raw GitHub content to avoid rate limits.
    """
    owner, repo = repo_full_name.split("/")
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/README.md"
    
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", raw_url],
            capture_output=True, text=True, timeout=30
        )
        
        if result.returncode == 0 and len(result.stdout) > 100:
            readme = result.stdout[:5000]  # First 5000 chars
            
            # Extract key sections
            analysis = {
                "repo": repo_full_name,
                "url_fetched": raw_url,
                "readme_length": len(readme),
                "has_architecture_section": "architecture" in readme.lower() or
                                            "## Arch" in readme or
                                            "### Arch" in readme,
                "has_agent_section": "agent" in readme.lower(),
                "has_orchestration_section": "orchestr" in readme.lower() or
                                               "workflow" in readme.lower(),
                "key_patterns_detected": []
            }
            
            # Detect patterns
            patterns = {
                "group_chat": ["group chat", "group_chat", "multi-agent conversation"],
                "hierarchy": ["supervisor", "manager", "coordinator", "orchestrator"],
                "workflow": ["workflow", "state machine", "graph", "dag"],
                "message_passing": ["message", "event", "pub-sub", "publish"],
                "tool_use": ["tool", "function calling", "execute function"],
                "memory": ["memory", "state", "context", "persistence"],
                "llm_chain": ["chain", "pipeline", "sequence"]
            }
            
            readme_lower = readme.lower()
            for pattern_name, keywords in patterns.items():
                if any(kw in readme_lower for kw in keywords):
                    analysis["key_patterns_detected"].append(pattern_name)
            
            return analysis
        else:
            return {"error": f"Failed to fetch README for {repo_full_name}", 
                    "status_code": result.returncode}
    except Exception as e:
        return {"error": str(e), "repo": repo_full_name}


def save_analysis(results: List[Dict], category: str):
    """Save analysis results to knowledge base."""
    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = os.popen('date +%Y%m%d_%H%M%S').read().strip()
    output_file = KNOWLEDGE_DIR / f"{category}_analysis_{timestamp}.json"
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    return str(output_file)


def generate_insights_report(results: List[Dict]) -> str:
    """Generate human-readable insights report."""
    
    report = "# Multi-Agent Orchestration Systems - Research Findings\n\n"
    report += f"*Generated: {os.popen('date').read().strip()}*\n\n"
    
    # Summary statistics
    total_repos = len([r for r in results if "error" not in r])
    total_patterns = sum(len(r.get("key_patterns_detected", [])) for r in results if "error" not in r)
    
    report += f"## Summary\n\n"
    report += f"- **Repositories analyzed:** {total_repos}\n"
    report += f"- **Total patterns detected:** {total_patterns}\n"
    report += f"- **Analysis method:** README extraction + pattern matching\n\n"
    
    # Per-repository analysis
    report += "## Repository Analysis\n\n"
    
    for result in results:
        if "error" in result:
            report += f"### ❌ {result.get('repo', 'Unknown')}\n"
            report += f"**Error:** {result['error']}\n\n"
            continue
        
        repo = result.get("repo", "Unknown")
        report += f"### ✅ {repo}\n\n"
        report += f"**README Length:** {result.get('readme_length', 'N/A')} chars\n"
        report += f"**Has Architecture Section:** {'Yes' if result.get('has_architecture_section') else 'No'}\n"
        report += f"**Has Agent Concepts:** {'Yes' if result.get('has_agent_section') else 'No'}\n"
        report += f"**Has Orchestration Concepts:** {'Yes' if result.get('has_orchestration_section') else 'No'}\n\n"
        
        patterns = result.get("key_patterns_detected", [])
        if patterns:
            report += f"**Detected Patterns:**\n"
            for p in patterns:
                report += f"- {p.replace('_', ' ').title()}\n"
        else:
            report += f"**Detected Patterns:** None specifically identified\n"
        
        report += "\n---\n\n"
    
    # Pattern frequency analysis
    report += "## Pattern Frequency Analysis\n\n"
    all_patterns = []
    for r in results:
        if "error" not in r:
            all_patterns.extend(r.get("key_patterns_detected", []))
    
    from collections import Counter
    pattern_counts = Counter(all_patterns)
    
    for pattern, count in pattern_counts.most_common():
        report += f"- **{pattern.replace('_', ' ').title()}:** {count} repositories\n"
    
    report += "\n## Recommendations for Command Center vF.5\n\n"
    report += "Based on this research:\n\n"
    
    if pattern_counts.get("hierarchy", 0) >= 2:
        report += "1. **Implement Supervisor Pattern:** Multiple frameworks use supervisor/worker hierarchy. Consider adding an 'Overseer' agent to coordinate Create Team.\n\n"
    
    if pattern_counts.get("group_chat", 0) >= 2:
        report += "2. **Group Chat Coordination:** AutoGen-style group chat could replace current event bus. Agents could negotiate task handoffs.\n\n"
    
    if pattern_counts.get("workflow", 0) >= 3:
        report += "3. **Workflow/Graph Orchestration:** LangGraph-style state machines. Define Create Team phases as nodes, agent execution as transitions.\n\n"
    
    if pattern_counts.get("memory", 0) >= 2:
        report += "4. **Shared Memory System:** Cross-agent memory beyond MemPalace. Working memory for active operations.\n\n"
    
    report += "## Next Steps\n\n"
    report += "1. Deep-dive into top 3 frameworks (by pattern richness)\n"
    report += "2. Extract specific code patterns (not just README concepts)\n"
    report += "3. Design Command Center vF.5 architecture based on learnings\n"
    report += "4. Update Create Team manifest with new orchestration patterns\n\n"
    
    report += "---\n*Report generated by Codex Intelligence System*\n"
    
    return report


def main():
    """Main analysis workflow."""
    
    # Priority multi-agent frameworks
    repos = [
        "microsoft/autogen",           # Microsoft's agent framework
        "crewAIInc/crewAI",            # CrewAI
        "langchain-ai/langgraph",      # LangGraph
        "openai/openai-agents-python", # OpenAI official
        "langfuse/langfuse",           # Observability
        "Significant-Gravitas/AutoGPT", # OG autonomous agent
        "joshbickett/fun-with-gpt",     # Fun implementations
        "e2b-dev/e2b",                 # Code execution
        "huggingface/smolagents",      # Lightweight agents
        "temporalio/temporal",         # Workflow orchestration
    ]
    
    print("🕸️  Starting Multi-Agent Framework Analysis...")
    print(f"   Target repositories: {len(repos)}")
    print()
    
    results = []
    for i, repo in enumerate(repos, 1):
        print(f"[{i}/{len(repos)}] Analyzing {repo}...", end=" ")
        analysis = analyze_multi_agent_readme(repo)
        results.append(analysis)
        
        if "error" not in analysis:
            patterns = len(analysis.get("key_patterns_detected", []))
            print(f"✅ Found {patterns} patterns")
        else:
            print(f"❌ {analysis.get('error', 'Failed')[:50]}")
    
    # Save raw results
    output_file = save_analysis(results, "multi_agent_frameworks")
    print(f"\n💾 Raw analysis saved to: {output_file}")
    
    # Generate insights report
    report = generate_insights_report(results)
    report_path = KNOWLEDGE_DIR / "multi_agent_insights_report.md"
    
    with open(report_path, 'w') as f:
        f.write(report)
    
    print(f"📄 Insights report saved to: {report_path}")
    
    # Summary
    successful = len([r for r in results if "error" not in r])
    print(f"\n✅ Analysis Complete!")
    print(f"   Successfully analyzed: {successful}/{len(repos)} repositories")
    print(f"   Results saved to: {KNOWLEDGE_DIR}")
    
    return results


if __name__ == "__main__":
    main()
