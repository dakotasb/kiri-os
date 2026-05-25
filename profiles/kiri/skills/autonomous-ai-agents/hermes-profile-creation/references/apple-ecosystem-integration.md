# Apple Ecosystem Integration for Hermes Agents

## Overview

Integrate Hermes agents with Apple services (Calendar, Reminders, Mail, Contacts, Health) using unified app-specific password authentication.

**Key Insight:** One app-specific password grants access to:
- Calendar (CalDAV)
- Reminders (CalDAV shared)
- Mail (IMAP)
- Contacts (CardDAV)
- Shortcuts (URL schemes)
- Notes (File/AppleScript)
- Health (via iPhone Shortcuts relay)

## Prerequisites

1. iCloud account with 2FA enabled
2. Device with Apple ID signed in
3. App-specific password generated at appleid.apple.com

## Credential Storage

Security requirements:
```bash
# Profile structure
~/.hermes/profiles/<agent>/
├── .env                          # 600 permissions
├── credentials/
│   ├── manifest.json            # 600 permissions
│   ├── apple-app-password.enc   # 600 permissions
│   └── setup-apple.sh           # 700 permissions
```

### Environment Variables

```bash
# ~/.hermes/profiles/tempo/.env

# Apple iCloud - Unified Credentials
APPLE_APP_PASSWORD=abcd-efgh-ijkl-mnop
APPLE_CALDAV_SERVER=https://caldav.icloud.com/
ICLOUD_USERNAME=user@icloud.com

# Mail (IMAP)
APPLE_MAIL_IMAP_SERVER=imap.mail.me.com
APPLE_MAIL_SMTP_SERVER=smtp.mail.me.com
APPLE_MAIL_TLS_PORT=993

# Contacts (CardDAV)
APPLE_CARDDAV_SERVER=https://contacts.icloud.com/

# Health (via Shortcuts relay)
APPLE_HEALTH_DATA_PATH=~/.hermes/profiles/tempo/health/daily/
```

## Service Protocols

| Service | Protocol | Endpoint | Notes |
|---------|----------|----------|-------|
| Calendar | CalDAV | caldav.icloud.com | Standard protocol |
| Reminders | CalDAV | caldav.icloud.com | Shared with Calendar |
| Mail | IMAP | imap.mail.me.com | Port 993 (SSL) |
| Contacts | CardDAV | contacts.icloud.com | contacts.icloud.com |
| Shortcuts | URL scheme | x-shortcut:// | Trigger remote |
| Notes | File export | iCloud Drive | Encrypted, limited API |
| Health | Shortcuts relay | iCloud Drive | iPhone bridge |

## iPhone HealthKit Relay (No Developer Account)

Since HealthKit API is iOS-only, use Shortcuts automation:

### iPhone Shortcut: "Send Health to Tempo"

```
Actions:
1. Get Health Sample (Step Count - Today)
2. Get Health Sample (Sleep Analysis - Last Night)
3. Get Health Sample (Heart Rate - Today)
4. Create Dictionary with all metrics
5. Save to File: iCloud Drive/tempo/health/daily/health_[date].json
```

### Automation Trigger

```
Automation: Time of Day
Trigger: 11:00 PM daily
Action: Run "Send Health to Tempo"
Ask Before Running: OFF
```

### Result

```bash
~/.hermes/profiles/tempo/health/daily/health_2026-05-16.json
```

## Security Model

```
[User iPhone] 
    → [HealthKit] (iOS locked)
    → [Shortcuts] (user automation)
    → [iCloud Drive] (end-to-end encrypted)
    → [Mac agent] (@tempo analyzes)
```

**No HealthKit write access from Mac** - this is intentional Apple security.

## Health Data Manifest

```json
{
  "credentials": {
    "apple_health": {
      "service": "Apple Health (via Shortcuts Relay)",
      "status": "configured",
      "relay_method": "iPhone Shortcuts → iCloud Drive → Mac",
      "data_types": [
        "Steps", "Sleep", "Heart Rate", 
        "Exercise", "Stand Hours"
      ],
      "frequency": "Daily (11:00 PM)"
    }
  }
}
```

## Quick Commands

```bash
# Calendar
hermes -p tempo chat -q "Show my week ahead"

# Reminders
hermes -p tempo chat -q "Today's task list"

# Mail
hermes -p tempo chat -q "Check urgent emails"

# Health
hermes -p tempo chat -q "Analyze sleep trends this week"
```

## Troubleshooting

### Health data not appearing?

1. Check Shortcuts automation enabled: Settings → Shortcuts → Automation
2. Verify iCloud Drive syncing: Settings → [Name] → iCloud → iCloud Drive
3. Test manual run of "Send Health to Tempo" shortcut

### CalDAV/CardDAV auth errors?

App-specific passwords may need re-generation:
```bash
# Check: Try curl to CalDAV
curl -u user@icloud.com:app-specific-password \
  https://caldav.icloud.com/ -v 2>&1 | grep HTTP
```

### Mail IMAP connection failed?

Apple apps use X-APPLE-ACCOUNT-TOKEN, not plain IMAP for newer iCloud accounts.
Legacy IMAP still works with app-specific passwords for most accounts.

## Limitations

| Service | Limitation | Reason |
|---------|------------|--------|
| **Screen Time** | No public API | Apple restriction |
| **HealthKit** | iOS-only access | Security/privacy model |
| **Notes** | Read-only, no API | Encrypted database |
| **Files** | Partial via iCloud Drive | Same-as-user access |

## See Also

- Skill: `hermes-profile-creation` for complete agent setup
- Skill: `apple-health-shortcuts` for advanced Shortcuts patterns
- Reference: `ollama-cloud-configuration` for model reference
