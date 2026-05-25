#!/bin/bash
# Secure Credential Storage Setup Script
# Creates credential directory structure with proper permissions

set -e

AGENT_NAME="${1:-tempo}"
CREDS_DIR="$HOME/.hermes/profiles/$AGENT_NAME/credentials"

echo "Setting up secure credential storage for @$AGENT_NAME..."

# Create credentials directory
mkdir -p "$CREDS_DIR"
chmod 700 "$CREDS_DIR"

# Create credential files
cat > "$CREDS_DIR/manifest.json" << 'EOF'
{
  "version": 1,
  "provider": "apple-ecosystem",
  "credentials": {
    "apple_app_password": {
      "status": "pending",
      "file": "credentials/apple-app-password.enc",
      "permissions": "600"
    }
  }
}
EOF
chmod 600 "$CREDS_DIR/manifest.json"

# Create placeholder credential files
for file in apple-app-password.enc google-credentials.enc google-token.enc; do
  cat > "$CREDS_DIR/$file" << PLACEHOLDER
# CREDENTIALS NOT YET CONFIGURED
# This file will be populated after OAuth/App Password setup
# Permissions: 600 (owner read/write only)
PLACEHOLDER
  chmod 600 "$CREDS_DIR/$file"
done

echo "✅ Secure credential storage created at: $CREDS_DIR"
echo "Permissions: drwx------ (700)"
echo ""
echo "Next steps:"
echo "1. Generate app-specific password at https://appleid.apple.com/"
echo "2. Store it in: $CREDS_DIR/apple-app-password.enc"
echo "3. Update .env with APPLE_APP_PASSWORD variable"
echo "4. Update manifest.json with credential status"
