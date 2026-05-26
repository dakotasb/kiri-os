#!/usr/bin/env python3
"""
Credential Manager for @tempo
Securely store and retrieve OAuth credentials
"""

import os
import sys
import json
from pathlib import Path

creds_dir = Path.home() / '.hermes' / 'profiles' / 'tempo' / 'credentials'

def store_google_credentials(credentials_json_path):
    """Store Google OAuth credentials securely"""
    import shutil
    
    with open(credentials_json_path, 'r') as f:
        creds = json.load(f)
    
    # Store in secure location
    target = creds_dir / 'google-credentials.enc'
    
    # In production, you'd encrypt this
    # For now, we use filesystem permissions
    with open(target, 'w') as f:
        json.dump({
            'client_id': creds['installed']['client_id'],
            'client_secret': creds['installed']['client_secret'],
            'auth_uri': creds['installed']['auth_uri'],
            'token_uri': creds['installed']['token_uri'],
        }, f, indent=2)
    
    os.chmod(target, 0o600)
    print(f"✅ Google credentials stored: {target}")
    print(f"   Client ID: {creds['installed']['client_id'][:20]}...")

def store_apple_password(password):
    """Store Apple app-specific password securely"""
    target = creds_dir / 'apple-app-password.enc'
    
    with open(target, 'w') as f:
        f.write(f"APPLE_APP_PASSWORD={password}\n")
    
    os.chmod(target, 0o600)
    print(f"✅ Apple password stored: {target}")
    print(f"   Length: {len(password)} characters")

def setup_complete():
    """Check if both credentials are configured"""
    manifest_path = creds_dir / 'manifest.json'
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    google_ok = (
        Path(manifest['credentials']['google']['credentials_file']).exists() and
        Path(manifest['credentials']['google']['token_file']).exists()
    )
    apple_ok = Path(manifest['credentials']['apple']['app_specific_password']).exists()
    
    print("\n" + "="*60)
    print("CREDENTIAL SETUP STATUS")
    print("="*60)
    print(f"✅ Google: {'Configured' if google_ok else 'Pending'}")
    print(f"✅ Apple: {'Configured' if apple_ok else 'Pending'}")
    print(f"\nOverall: {'✅ COMPLETE' if google_ok and apple_ok else '⏳ IN PROGRESS'}")
    
    return google_ok and apple_ok

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage:")
        print("  credential-manager.py store-google <path/to/client_secret.json>")
        print("  credential-manager.py store-apple <password>")
        print("  credential-manager.py status")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == 'store-google' and len(sys.argv) == 3:
        store_google_credentials(sys.argv[2])
    elif cmd == 'store-apple' and len(sys.argv) == 3:
        store_apple_password(sys.argv[2])
    elif cmd == 'status':
        setup_complete()
    else:
        print("Invalid command")
        sys.exit(1)
