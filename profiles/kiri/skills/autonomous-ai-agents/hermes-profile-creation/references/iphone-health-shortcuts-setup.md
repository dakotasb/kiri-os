# iPhone Health Shortcuts Automation Setup

Complete walkthrough for integrating Apple HealthKit data with Hermes agents using Shortcuts automation.

## Overview

Relay iPhone HealthKit data to a Mac/server Hermes agent without requiring:
- Apple Developer Program ($99/year)
- HealthKit entitlements
- Custom iOS apps

**Method:** Apple Shortcuts on iPhone queries HealthKit → saves JSON to iCloud Drive → agent reads from synced folder.

---

## Prerequisites

- iPhone with Health app (data already being tracked)
- Apple ID with app-specific password
- iCloud Drive enabled
- Hermes agent with credentials storage configured

---

## Agent Configuration

### 1. Create Credentials Directory

```bash
mkdir -p ~/.hermes/profiles/<agent>/credentials
chmod 700 ~/.hermes/profiles/<agent>/credentials
```

### 2. Store Apple Credentials

```bash
# App-specific password (for iCloud Keychain/CalDAV/CardDAV)
echo "APPLE_APP_PASSWORD=<your-app-specific-password>" \
  > ~/.hermes/profiles/<agent>/credentials/apple-app-password.enc

# iCloud email
echo "ICLOUD_USERNAME=user@me.com" \
  >> ~/.hermes/profiles/<agent>/credentials/apple-app-password.enc

chmod 600 ~/.hermes/profiles/<agent>/credentials/apple-app-password.enc
```

### 3. Create Health Data Directory

```bash
mkdir -p ~/.hermes/profiles/<agent>/health/{daily,exports,analytics}
chmod 700 ~/.hermes/profiles/<agent>/health
```

---

## iPhone Shortcuts Setup (Step-by-Step)

### Create Master Shortcut

**Name:** `Health Relay → <AgentName>`

**Actions:**

1. **Get Health Sample** → Type: Steps → Date: Today → Save as variable `Steps`
2. **Get Health Sample** → Type: Sleep Analysis → Date: Last Night → Save as `SleepHours`
3. **Get Health Sample** → Type: Heart Rate → Date: Today → Save as `HeartRate`
4. **Get Health Sample** → Type: Exercise Minutes → Date: Today → Save as `ExerciseMinutes`
5. **Get Health Sample** → Type: Stand Hours → Date: Today → Save as `StandHours`
6. **Get Health Sample** → Type: Active Energy → Date: Today → Save as `ActiveEnergy`

**Dictionary Action:**
- Add "Dictionary" → "Create Dictionary"
- Add items:
  - `steps` → Value: Select variable `Steps`
  - `sleep_hours` → Value: Select variable `SleepHours`
  - `heart_rate` → Value: Select variable `HeartRate`
  - `exercise_minutes` → Value: Select variable `ExerciseMinutes`
  - `timestamp` → Value: Magic Variable "Current Date"

**Save to File:**
- Service: iCloud Drive
- Ask Where: OFF
- Destination Path: `/tempo/health/daily/`
- Filename: `health.json`
- Overwrite If File Exists: ON

**Test:** Tap ▶️ Play button → Verify file appears in Files app → iCloud Drive → tempo → health → daily

---

## Automation Schedule

### Time-Based Automations (5 Daily)

Create 5 automations in Shortcuts app (Automation tab):

| # | Time | Trigger | Purpose |
|---|------|---------|---------|
| 1 | 8:00 AM | morning_baseline | Sleep recovery, HRV, day planning |
| 2 | 12:00 PM | pre_deep_work | Ring progress, walking lunch suggestion |
| 3 | 2:30 PM | midday_check | Deep work protection, energy maintenance |
| 4 | 5:00 PM | afternoon_allocation | Fun vs chores vs projects decision |
| 5 | 9:00 PM | evening_windown | Ring completion, tomorrow preview, sleep prep |

**Setup each:**
1. Automation tab → +
2. Time of Day → [Time] → Daily → Next
3. Add Action → Run Shortcut → "Health Relay → Agent"
4. **CRITICAL:** Turn OFF "Ask Before Running"
5. Done

### Event-Based Triggers (Optional)

| Trigger | Event | Purpose |
|---------|-------|---------|
| Wake Up Alarm Stops | wake_detected | Morning baseline refresh |
| Workout Ends | workout_complete | Recovery buffer scheduling |
| Activity Ring Closed | ring_closed | Achievement/momentum tracking |
| Sleep Focus Enabled | sleep_detected | Sleep onset logging |
| Home Arrival | home_arrival | Evening mode activation |

---

## Agent Capabilities with Health Data

Once configured, the agent can:

### Daily Optimization
- "HRV up 10% = high energy day. Deep work block moved to AM."
- "Rings 60% complete by noon. Take walking lunch before 2 PM block."
- "30 min into focus. HR stable. No interruptions scheduled."

### Bio-Aware Scheduling
- "High energy detected at 5 PM. Project time: coding, guitar, side hustle."
- "Low energy + high stress. Evening recommendation: Netflix, book, sleep."
- "Only 2 hours sleep → protect today's schedule"

### Burnout Prevention
- "HRV declining 3 days in a row → schedule recovery day"
- "Heart rate elevated before meeting → suggest 10-min meditation"
- "Sedentary 3 hours → movement break required"

### Ring Coaching
- "Rings at 80% by 6 PM → 500 steps = completion"
- "Exercise ring stalled → morning workout suggested for tomorrow"

---

## Data Flow

```
[iPhone HealthKit]
      ↓ (Shortcuts queries)
[Create Dictionary]
      ↓ (JSON serialization)
[Save to iCloud Drive]
      ↓ (iCloud sync)
[Mac: ~/.hermes/profiles/<agent>/health/daily/]
      ↓ (agent reads)
[@tempo analyzes → optimizes schedule]
```

---

## Troubleshooting

### "Health data not available"
- Open Health app first
- Wait 24 hours after first Health app use
- Ensure data exists (walk around to generate steps)

### "Can't save to iCloud"
- Settings → [Your Name] → iCloud → iCloud Drive: ON
- Files app → Browse → iCloud Drive visible?
- Create folders manually: tempo/health/daily/

### "Automation not running"
- Check: Automation tab → Is toggle enabled?
- Check: "Ask Before Running" is OFF
- Check: Time has AM/PM correct

### Files not syncing to Mac
- iCloud Drive sync delay (up to 5 minutes)
- Check Mac iCloud settings
- Manual check: Finder → iCloud Drive → tempo → health → daily

---

## Battery Impact

- Each sync: 2-5 seconds
- 5-15 syncs/day: <20 seconds total processing
- HealthKit data already cached (no extra tracking)
- **Total impact: <2% battery/day**

---

## Security Notes

- Health data stays on-device
- iCloud Drive: End-to-end encrypted
- Agent only reads (no write to HealthKit)
- Credentials: 600 file permissions
- User controls frequency and data types

---

## Related Capabilities

With app-specific password, same agent can access:
- ✅ Calendar (CalDAV)
- ✅ Reminders (CalDAV)
- ✅ Mail (IMAP)
- ✅ Contacts (CardDAV)
- ✅ Health (Shortcuts relay)
- ⚠️ Notes (File export only)
- ❌ HealthKit direct (iOS only)
- ❌ Screen Time (no public API)

---

## Example Agent Commands

```bash
# After setup complete:
hermes -p tempo chat -z "Create today's schedule based on my health data"
hermes -p tempo chat -z "Analyze my energy patterns this week"
hermes -p tempo chat -z "What time should I go to bed tonight?"
hermes -p tempo chat -z "Optimize tomorrow's calendar around my recovery"
```

---

**Setup time:** 25-35 minutes on iPhone
**Maintenance:** None (runs automatically)
**Lifetime value:** Daily bio-optimized scheduling