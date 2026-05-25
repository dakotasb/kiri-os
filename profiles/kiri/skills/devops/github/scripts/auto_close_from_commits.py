#!/usr/bin/env python3
"""
GitHub Auto-Close Script
Extracts issue numbers from commit messages and auto-closes them on GitHub.

Usage:
  ./auto_close_from_commits.py --since "2026-05-15" --repo dakotasb/Kiri
"""

import subprocess
import re
import json
import sys
from datetime import datetime

def run_git(args, cwd=None):
    """Run git command and return output."""
    result = subprocess.run(
        ["git"] + args,
        capture_output=True,
        text=True,
        cwd=cwd
    )
    return result.stdout.strip()

def run_gh(args):
    """Run GitHub CLI command."""
    result = subprocess.run(
        ["gh"] + args,
        capture_output=True,
        text=True
    )
    return result.returncode == 0, result.stdout, result.stderr

def get_commits_since(since_date, branch="main"):
    """Get commits since date with full message."""
    log_format = '%H|%an|%s|%b'
    output = run_git([
        "log", f"--since={since_date}",
        f"--format={log_format}",
        branch
    ])
    
    commits = []
    for line in output.split('\n'):
        if '|' in line:
            parts = line.split('|', 3)
            commits.append({
                'hash': parts[0],
                'author': parts[1] if len(parts) > 1 else '',
                'subject': parts[2] if len(parts) > 2 else '',
                'body': parts[3] if len(parts) > 3 else ''
            })
    return commits

def extract_issue_number(commit_msg):
    """Extract issue numbers from commit message."""
    # Patterns: "Fix #123", "Closes #456", "resolves #789", "Issue #101"
    patterns = [
        r'[Ff]ix(?:es)?\s+#(\d+)',
        r'[Cc]los(?:es?)?\s+#(\d+)',
        r'[Rr]esolve(?:s?)?\s+#(\d+)',
        r'[Ii]ssue\s+#(\d+)',
        r'#(\d+)\s+(?:fix|close|resolve)'
    ]
    
    issues = set()
    for pattern in patterns:
        matches = re.findall(pattern, commit_msg)
        issues.update(matches)
    
    return list(issues)

def extract_agent_name(commit_msg):
    """Extract agent name from commit message."""
    patterns = [
        r'\[([A-Z][a-z]+)\]',  # [Agent]
        r'@([a-z]+)',           # @agent
        r'by\s+@?([a-z]+)',     # by @agent or by agent
    ]
    
    for pattern in patterns:
        match = re.search(pattern, commit_msg)
        if match:
            return match.group(1)
    return "Unknown"

def close_issue(repo, issue_num, agent_name, commit_hash):
    """Close GitHub issue with comment."""
    comment = f"Fixed by @{agent_name} in commit {commit_hash[:8]}"
    
    success, stdout, stderr = run_gh([
        "issue", "close", issue_num,
        "--repo", repo,
        "--comment", comment
    ])
    
    return success

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Auto-close GitHub issues from commits")
    parser.add_argument("--since", required=True, help="Date to check commits from (YYYY-MM-DD)")
    parser.add_argument("--repo", required=True, help="GitHub repo (owner/repo)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without closing")
    args = parser.parse_args()
    
    print(f"Checking commits since {args.since}...")
    commits = get_commits_since(args.since)
    print(f"Found {len(commits)} commits")
    
    closed_issues = []
    
    for commit in commits:
        full_msg = commit['subject'] + ' ' + commit['body']
        issues = extract_issue_number(full_msg)
        agent = extract_agent_name(full_msg)
        
        if issues:
            print(f"\nCommit {commit['hash'][:8]} by {commit['author']}:")
            print(f"  Message: {commit['subject'][:60]}...")
            print(f"  Agent: {agent}")
            print(f"  Issues: {', '.join(['#' + i for i in issues])}")
            
            for issue in issues:
                if args.dry_run:
                    print(f"  [DRY-RUN] Would close #{issue}")
                else:
                    if close_issue(args.repo, issue, agent, commit['hash']):
                        print(f"  ✅ Closed #{issue}")
                        closed_issues.append({
                            'number': issue,
                            'agent': agent,
                            'commit': commit['hash'][:8]
                        })
                    else:
                        print(f"  ❌ Failed to close #{issue}")
    
    # Summary
    print("\n" + "="*50)
    print(f"TOTAL: Closed {len(closed_issues)} issues")
    for item in closed_issues:
        print(f"  #{item['number']} by @{item['agent']} ({item['commit']})")
    
    # Save state
    state_file = ".last_processed_commit"
    if commits:
        with open(state_file, 'w') as f:
            f.write(commits[0]['hash'])
        print(f"\nState saved to {state_file}")

if __name__ == "__main__":
    main()
