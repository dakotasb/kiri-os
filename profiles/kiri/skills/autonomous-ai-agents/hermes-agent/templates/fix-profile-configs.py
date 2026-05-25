#!/usr/bin/env python3
"""
Bulk Fix Agent Profile Credentials

Fixes missing .env files and auth.json for Hermes agent profiles.
Uses the working profile (usually 'kiri') as the master template.

Usage:
    python3 fix-profile-configs.py [--dry-run]

What it does:
    1. Finds all profiles in ~/.hermes/profiles/
    2. Identifies profiles missing .env or auth.json
    3. Creates missing .env files with OLLAMA_API_KEY
    4. Copies auth.json from the master profile
    5. Reports which profiles were fixed

Requirements:
    - Master profile (default: kiri) must exist and have correct credentials
    - Write access to ~/.hermes/profiles/

Safety:
    - Never overwrites existing files (unless --force)
    - --dry-run shows what would be done without making changes
"""

import argparse
import os
import glob
import json
import sys
from pathlib import Path


def get_profiles_path():
    """Get the Hermes profiles directory."""
    hermes_home = os.environ.get('HERMES_HOME', os.path.expanduser('~/.hermes'))
    return Path(hermes_home) / 'profiles'


def get_master_key(master_profile_path):
    """Extract the OLLAMA_API_KEY from master's .env."""
    env_file = master_profile_path / '.env'
    if not env_file.exists():
        print(f"Error: Master profile has no .env: {env_file}")
        sys.exit(1)
    
    with open(env_file, 'r') as f:
        for line in f:
            if line.startswith('OLLAMA_API_KEY='):
                return line.split('=', 1)[1].strip()
    
    print(f"Error: No OLLAMA_API_KEY found in {env_file}")
    sys.exit(1)


def get_master_auth(master_profile_path):
    """Get the content of master's auth.json."""
    auth_file = master_profile_path / 'auth.json'
    if not auth_file.exists():
        print(f"Error: Master profile has no auth.json: {auth_file}")
        sys.exit(1)
    
    with open(auth_file, 'r') as f:
        return f.read()


def find_profiles_needing_fix(profiles_path, master_profile_name):
    """Find all profiles missing .env or auth.json."""
    missing_env = []
    missing_auth = []
    wrong_key = []
    
    correct_key = None
    master_path = profiles_path / master_profile_name
    if master_path.exists():
        correct_key = get_master_key(master_path)
    
    for profile_dir in profiles_path.iterdir():
        if not profile_dir.is_dir():
            continue
        if profile_dir.name.startswith('.'):
            continue
        if profile_dir.name == master_profile_name:
            continue
        
        # Check .env
        env_file = profile_dir / '.env'
        if not env_file.exists():
            missing_env.append(profile_dir.name)
        else:
            # Check if key is correct
            if correct_key:
                with open(env_file, 'r') as f:
                    for line in f:
                        if line.startswith('OLLAMA_API_KEY='):
                            env_key = line.split('=', 1)[1].strip()
                            if env_key != correct_key:
                                wrong_key.append(profile_dir.name)
                            break
        
        # Check auth.json
        auth_file = profile_dir / 'auth.json'
        if not auth_file.exists():
            missing_auth.append(profile_dir.name)
    
    return missing_env, missing_auth, wrong_key


def create_env_file(profile_path, api_key, dry_run=False):
    """Create .env file for a profile."""
    env_content = f"""# {profile_path.name.capitalize()} Profile Environment Variables
GATEWAY_ALLOW_ALL_USERS=true
OLLAMA_API_KEY={api_key}
"""
    env_file = profile_path / '.env'
    
    if dry_run:
        print(f"  [DRY-RUN] Would create: {env_file}")
        return
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    print(f"  Created: {env_file}")


def copy_auth_file(profile_path, master_auth_content, dry_run=False):
    """Copy auth.json from master to a profile."""
    auth_file = profile_path / 'auth.json'
    
    if dry_run:
        print(f"  [DRY-RUN] Would create: {auth_file}")
        return
    
    with open(auth_file, 'w') as f:
        f.write(master_auth_content)
    print(f"  Created: {auth_file}")


def main():
    parser = argparse.ArgumentParser(
        description='Fix missing credentials for Hermes agent profiles'
    )
    parser.add_argument(
        '--master', default='kiri',
        help='Master profile to copy credentials from (default: kiri)'
    )
    parser.add_argument(
        '--dry-run', action='store_true',
        help='Show what would be done without making changes'
    )
    parser.add_argument(
        '--force', action='store_true',
        help='Overwrite existing files (dangerous!)'
    )
    
    args = parser.parse_args()
    
    profiles_path = get_profiles_path()
    if not profiles_path.exists():
        print(f"Error: Profiles directory not found: {profiles_path}")
        sys.exit(1)
    
    print(f"Using master profile: {args.master}")
    master_path = profiles_path / args.master
    if not master_path.exists():
        print(f"Error: Master profile not found: {master_path}")
        sys.exit(1)
    
    # Get master credentials
    print(f"Reading credentials from {master_path}...")
    correct_key = get_master_key(master_path)
    print(f"  Master key (masked): {correct_key[:20]}...")
    
    master_auth = get_master_auth(master_path)
    print(f"  Master auth.json: {len(master_auth)} bytes")
    
    # Find profiles needing fixes
    print(f"\nScanning {profiles_path} for profiles...")
    missing_env, missing_auth, wrong_key = find_profiles_needing_fix(
        profiles_path, args.master
    )
    
    total_issues = len(missing_env) + len(missing_auth) + len(wrong_key)
    print(f"\nFound {total_issues} issues:")
    print(f"  Missing .env: {len(missing_env)}")
    print(f"  Missing auth.json: {len(missing_auth)}")
    print(f"  Wrong API key: {len(wrong_key)}")
    
    if total_issues == 0:
        print("\nAll profiles are properly configured!")
        return
    
    # Show details
    if missing_env:
        print(f"\nProfiles missing .env:")
        for p in missing_env:
            print(f"  - {p}")
    
    if missing_auth:
        print(f"\nProfiles missing auth.json:")
        for p in missing_auth:
            print(f"  - {p}")
    
    if wrong_key:
        print(f"\nProfiles with wrong API key:")
        for p in wrong_key:
            print(f"  - {p}")
    
    if args.dry_run:
        print("\n[DRY RUN] No changes made.")
        return
    
    # Fix profiles
    print(f"\nFixing {total_issues} profiles...")
    
    # Combine all unique profiles needing attention
    profiles_to_fix = set(missing_env + missing_auth + wrong_key)
    
    for profile_name in sorted(profiles_to_fix):
        profile_path = profiles_path / profile_name
        print(f"\n{profile_name}:")
        
        # Fix .env if needed
        if profile_name in missing_env or (profile_name in wrong_key and args.force):
            if profile_name in wrong_key and not args.force:
                print(f"  [SKIP] Already has .env (use --force to overwrite)")
            else:
                create_env_file(profile_path, correct_key, dry_run=args.dry_run)
        
        # Fix auth.json if needed
        if profile_name in missing_auth:
            copy_auth_file(profile_path, master_auth, dry_run=args.dry_run)
    
    print(f"\nDone! Fixed {len(profiles_to_fix)} profiles.")
    print(f"\nNext steps:")
    print(f"  1. Restart any running agent gateways:")
    print(f"     hermes -p <profile> gateway restart")
    print(f"  2. Test a fixed agent:")
    print(f"     hermes -p <profile> chat -q 'test' -Q")


if __name__ == '__main__':
    main()
