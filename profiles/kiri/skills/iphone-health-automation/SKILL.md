---
name: iphone-health-automation
title: iPhone Health Data Automation with Shortcuts
description: Build sophisticated personal automation using iPhone Shortcuts, Apple Health data, and time-based triggers. Create intelligent agents like "Tempo" that optimize schedule, energy, and productivity by combining health metrics, chronobiology, and contextual decision-making.
when_to_use:
  - User wants to build personal automation around health/energy/productivity
  - Integrating iPhone Health data (steps, sleep, heart rate, workouts) with agent workflows
  - Creating time-based automations with multiple daily triggers
  - Building "Peak Performance" schedules based on circadian rhythms and custody patterns
  - Connecting Apple Shortcuts Gallery to Hermes agent orchestration
trigger_phrases:
  - "iPhone shortcuts automation"
  - "health data workflow"
  - "tempo controller"
  - "peak performance day"
  - "energy management"
  - "shortcuts gallery integration"
  - "Apple Health automation"
prerequisites:
  - iPhone with Shortcuts app
  - Apple Health / Apple Watch for data
  - iCloud Drive for file storage
  - Hermes agent to consume the data
---

# iPhone Health Data Automation

## Overview

This skill enables building intelligent personal automation systems that:
1. **Collect** health data from Apple Health (steps, sleep, heart rate, workouts)
2. **Calculate** energy scores and contextual state
3. **Decide** optimal actions based on time-of-day + personal context
4. **Trigger** Gallery shortcuts and agent workflows
5. **Learn** patterns over time via saved analytics

## The Pattern: Health → Decision → Action

```
TRIGGER (Time/Location/Event)
    ↓
DATA (Health Samples)
    ↓
CALCULATION (Energy Score)
    ↓
DECISION (IF time + energy + context)
    ↓
ACTION (Run Shortcut / Notify / Save)
```

## Quick Start: Build Your First Tempo Controller

### Step 1: Create Master Shortcut

1. **Shortcuts app** → "+" → Name: `Tempo Controller`
2. **Add Health Samples:**
   - "Get Health Sample" → Steps → Today
   - "Get Health Sample" → Sleep → Previous Night
   - "Get Health Sample" → Heart Rate → Today
   - "Get Health Sample" → Exercise Minutes → Today

### Step 2: Build Decision Dictionary

3. **Add "Create Dictionary"**
4. **Add keys:**
   | Key | Value Source |
   |-----|--------------|
   | `steps` | Samples (Steps action) |
   | `sleep_hours` | Samples (Sleep action) |
   | `heart_rate` | Samples (Heart Rate action) |
   | `exercise_mins` | Samples (Exercise action) |
   | `timestamp` | Current Date |

### Step 3: Add Time-Phase Logic

5. **Add "If" for time phases:**
   ```
   IF 6-7 AM: TimePhase = "MORNING_ROUTINE"
   IF 8-11:30 AM: TimePhase = "DEEP_WORK_PEAK"
   IF 11:30 AM-1 PM: TimePhase = "LUNCH_RECOVERY"
   IF 1-3 PM: TimePhase = "ADMIN_VALLEY"
   IF 3-5 PM: TimePhase = "SECOND_PEAK"
   IF 5-10 PM: TimePhase = "EVENING"
   IF 10+ PM: TimePhase = "WIND_DOWN"
   ```

### Step 4: Calculate Energy Score

6. **Add "Calculate":**
   - `SleepScore = (SleepHours / 8) * 30`
   - `ActivityScore = (Steps / 10000) * 30`
   - `HeartScore = (90 - HeartRate) / 90 * 40`
   - `TotalEnergy = SleepScore + ActivityScore + HeartScore`

7. **Classify:**
   - IF TotalEnergy > 70 → `EnergyLevel = "HIGH"`
   - IF TotalEnergy 40-70 → `EnergyLevel = "MEDIUM"`
   - IF TotalEnergy < 40 → `EnergyLevel = "LOW"`

### Step 5: Compound Decision Engine

8. **Nested IF logic example:**
   ```
   IF TimePhase == "DEEP_WORK_PEAK" 
      AND EnergyLevel == "HIGH"
      AND Meetings_Today < 2:
      → Show: "⭐ PEAK CONDITIONS!"
      → Run: "Focus Mode - Deep Work"
      → Set Focus: ON
   ```

### Step 6: Create Automations

9. **Automation tab** → "+" → "Time of Day"
10. Create 5 daily triggers:
    - 8:00 AM, 12:00 PM, 2:30 PM, 5:00 PM, 9:00 PM
11. **CRITICAL:** Turn **OFF** "Ask Before Running" on all

### Step 7: Grant Permissions

12. **Settings → Privacy → Health → Shortcuts → Allow All**
13. First run will request permissions - grant them

## Multi-Dimensional Optimization

The most powerful automations combine multiple dimensions:

### Temporal (When)
- Chronobiology (cognitive peaks: 8-11 AM, 3-5 PM)
- Ultradian rhythms (90-min focus, 15-min break)
- Day of week patterns
- Custody schedule (if applicable)

### Personal Context (Who)
- Custody status (kid days vs solo days)
- Work location (office vs remote)
- Spouse schedule coordination

### Energy State (How)
- Sleep quality (hours + HRV)
- Exercise completed (Tonal/sessions)
- Meeting load (cognitive fatigue)
- Recovery debt

### Environmental (Where)
- Weather (sunny = walk breaks)
- Location (home vs office vs coffee shop)

## Gallery Shortcuts Integration

Download these from Shortcuts Gallery for Tempo to trigger:

| Shortcut | When Tempo Runs It |
|----------|-------------------|
| **Focus Mode** | Deep work windows |
| **Morning Routine** | High energy mornings |
| **Quick Start** | Low energy days |
| **Sleep Helper** | Wind-down time |
| **End of Day Report** | Daily retrospective |

**How-to:** Search Gallery → Download → Tempo triggers via "Run Shortcut" action

## Files and References

**See `templates/personal-automation-framework/` for:**
- Complete IF condition reference
- Day-type classification examples
- Energy calculation formulas
- Gallery shortcut recommendations

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Shortcuts don't auto-run | Settings → Privacy → Health → Shortcuts → Allow All |
| File not saving | Create folder structure in Files app first |
| Health variables missing | Run once manually, grant permissions |
| No Current Date variable | Add "Get Current Date" action BEFORE dictionary |
| Dictionary in dictionary | You're doing it right - one dict with multiple keys |

## Advanced Patterns

### Event-Based Triggers (Beyond Time)
- **Workout complete** → Suggest recovery activities
- **Ring closed** → Celebrate, enable evening mode
- **Home arrival** → Transition to family mode
- **Wake from alarm** → Morning routine activation

### Multi-Step Pipelines
Gallery shortcuts can chain together:
```
Tempo Controller
    ↓ Energy = HIGH
Run "Tonal - Full Workout"
    ↓ After workout completes
Run "Focus Mode - Deep Work"
    ↓ After 90 minutes
Show: "Break time! Walk?"
```

### Analytics Over Time
Save structured data to iCloud:
```json
{
  "date": "2026-05-16",
  "day_type": "Peak_Performance",
  "energy_score": 82,
  "decisions_made": ["Tonal_full", "Deep_work_90min"],
  "outcomes": ["High_productivity", "Date_night"]
}
```

Tempo learns patterns from this data.

## Real-World Example: Peak Performance Tuesday

```yaml
Profile: Peak Performance Day (custody-free, office)

6:00 AM: Wake
   → Tempo: "Energy forecast: HIGH. Tonal 60-min ready"
   → Run: "Tonal - Full Workout"

8:00 AM: Office start
   → Tempo: "PEAK COGNITIVE WINDOW - Protect it!"
   → Run: "Focus Mode - Deep Work"
   → Block: Notifications OFF

10:30 AM: Ultradian break
   → Tempo: "⏰ 90 min complete - walk?"

12:00 PM: Lunch
   → IF steps < 3000: "Walking lunch? 20 min = 2K steps"

2:30 PM: Admin valley
   → Tempo: "Energy still good - inbox sprint"
   → Run: "Inbox Zero Sprint"

5:30 PM: Commute
   → Tempo: "Still have energy! Date night idea?"

6:30 PM: Home
   → IF energy > 80: "High energy Tuesday! Try new restaurant?"
   → Wife arrives: Golden hour begins

9:30 PM: Wind down
   → Tempo: "10 PM target. Sleep hygiene now."
   → Run: "Sleep Prep"
```

## Related Skills

- `hermes-profile-creation` - Create @tempo agent
- `nextjs-cache-troubleshooting` - Fix broken dev servers
- `kanban-orchestrator` - Delegate, don't do the work yourself

## Session Log

See references/session-iphone-setup-2026-05-16.md for full conversation including:
- Custody schedule integration
- Tonal workout system connection
- Wife coordination time blocks
- Chore reminders and lawn maintenance
- Project mode triggers for smart home work
