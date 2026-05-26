# @tempo - Personal Calendar & Schedule Optimization Agent

## 🎯 Mission
Transform your daily life into a CEO-level precision machine using your Apple ecosystem.

## 📱 Apple Ecosystem Coverage

### ✅ Fully Integrated
| Service | Protocol | Status |
|---------|----------|--------|
| **Calendar** | CalDAV | ✅ Active |
| **Reminders** | CalDAV | ✅ Active |
| **Mail** | IMAP | ✅ Active |
| **Contacts** | CardDAV | ✅ Active |
| **Shortcuts** | URL Schemes | ✅ Active |

### ⚠️ Limited / Partial
| Service | Limitation | Workaround |
|---------|------------|------------|
| **Notes** | Encrypted, no API | iCloud Drive export, Shortcuts automation |

### ❌ Requires iPhone / Dev Account
| Service | Why | Alternative |
|---------|-----|-------------|
| **Health** | HealthKit API iOS-only | Import health_export.xml manually |
| **Screen Time** | No public API | Shortcuts-based tracking only |

## 🔐 Credentials

**All Apple services use the same secure credentials:**
- Email: dakotasb@me.com
- Auth: App-specific password (stored encrypted)
- Security: 600 file permissions

## 🚀 Quick Commands

### Calendar
```bash
hermes -p tempo chat -q "Show my week ahead"
hermes -p tempo chat -q "Block 2 hours for deep work tomorrow"
```

### Reminders
```bash
hermes -p tempo chat -q "What's on my task list today?"
hermes -p tempo chat -q "Create reminder to call mom Friday at 5pm"
```

### Mail
```bash
hermes -p tempo chat -q "Check urgent emails"
hermes -p tempo chat -q "Draft reply to [sender]"
```

### Contacts
```bash
hermes -p tempo chat -q "When did I last talk to Sarah?"
hermes -p tempo chat -q "Schedule follow-up with all inactive contacts"
```

### Shortcuts
```bash
hermes -p tempo chat -q "Trigger morning routine"
hermes -p tempo chat -q "End work day and prep for tomorrow"
```

### Daily Optimization
```bash
hermes -p tempo chat -q "Run daily planning: create today's schedule"
hermes -p tempo chat -q "Audit my calendar for time leaks"
```

## 🎯 CEO Schedule Architecture

**Deep Work Block**: 08:00-12:00 (no meetings)
**Meeting Window**: 13:00-17:00
**Morning Routine**: 06:00-08:00 (exercise + planning)
**Evening Wind Down**: 17:00-18:00
**Sleep Protection**: 22:00-06:00 (Do Not Disturb)

**Meeting Rules:**
- 25/50-minute defaults (not 30/60)
- 10-minute buffers between meetings
- Max 50% of day in meetings
- Async first: "Can this be an email?"

## 📁 Files

- `~/.hermes/profiles/tempo/credentials/` - Secure credential storage
- `~/personal/` - Deliverables (schedules, analytics, templates)

## ⚙️ Configuration

- **Team**: Personal
- **Model**: kimi-k2.5
- **Fallbacks**: kimi-k2.6, deepseek-v4-flash
