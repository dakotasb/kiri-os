# Health Data Relay: iPhone → @tempo
# Using Apple Shortcuts as a bridge (No Developer Account Required!)

## How It Works

iPhone runs Shortcuts → Queries HealthKit → Sends data to Mac → @tempo consumes

```
[iPhone HealthKit] → [Shortcut] → [iCloud Drive / URL scheme] → [Mac] → [@tempo analyzes]
```

---

## OPTION A: iPhone Shortcuts (RECOMMENDED)

### Step 1: Create "Health Report" Shortcut on iPhone

On your iPhone, open **Shortcuts app** and create a new shortcut:

```
Shortcut Name: "Send Health to Tempo"

Actions:
1. Get Health Sample
   - Type: Step Count
   - Date: Today
   
2. Get Health Sample
   - Type: Sleep Analysis
   - Date: Last Night
   
3. Get Health Sample
   - Type: Heart Rate
   - Date: Today (average)
   
4. Get Health Sample
   - Type: Exercise Minutes
   - Date: Today
   
5. Get Health Sample
   - Type: Stand Hours
   - Date: Today
   
6. Get Health Sample
   - Type: Mindful Minutes
   - Date: Today

7. Create Dictionary:
   {
     "date": "[Current Date]",
     "steps": "[Step Count]",
     "sleep_hours": "[Sleep Duration]",
     "avg_heart_rate": "[Heart Rate]",
     "exercise_minutes": "[Exercise Minutes]",
     "stand_hours": "[Stand Hours]",
     "mindful_minutes": "[Mindful Minutes]",
     "timestamp": "[Current Date]"
   }

8. Save to File:
   - Service: iCloud Drive
   - Folder: /tempo/health/daily/
   - Filename: "health_[Current Date].json"

9. Show Notification:
   - Title: "Health Data Synced"
   - Body: "Sent [Step Count] steps to @tempo"
```

### Step 2: Set Up Automation

1. In Shortcuts app, go to **Automation** tab
2. Tap **+** → **Create Personal Automation**
3. Choose trigger: **Time of Day**
4. Set time: **11:00 PM** (daily)
5. Action: **Run Shortcut** → "Send Health to Tempo"
6. Turn OFF "Ask Before Running"
7. Tap **Done**

**Optional Additional Triggers:**
- **When Bedtime Starts**: Capture sleep data
- **When Wake Up Alarm Stops**: Refresh morning stats
- **When Fitness Activity Completed**: Log workout

---

## OPTION B: Manual Export (Weekly Deep Analysis)

### For Historical Trends & Medical Records

1. Open **Health app** on iPhone
2. Tap your profile picture (top right)
3. Tap **Export All Health Data**
4. Choose method: **AirDrop** → Your Mac
5. Save to: `~/personal/health/exports/`

**@tempo will:**
- Import the export.xml file
- Analyze trends over time
- Identify patterns
- Generate health reports

---

## What @tempo Can Do With Health Data

### Daily Optimization
- "You only got 5 hours sleep - schedule a 20-min nap this afternoon"
- "Step count is low today - take a walk before dinner"
- "Heart rate variability suggests high stress - protect your calendar"
- "You closed all rings! Celebrate with extra leisure time"

### Sleep Optimization
- "Your deep sleep was 45 mins last night - consider earlier bedtime"
- "Sleep consistency is off - aim for same bed/wake times"

### Energy Management
- "Morning heart rate is 10bpm higher than usual - prioritize easy tasks"
- "Workout duration trending down - schedule gym time"

### Bio-Optimization Alerts
- **GREEN**: All metrics optimal
- **YELLOW**: One metric off (monitor)
- **ORANGE**: Multiple metrics concerning (intervention)
- **RED**: Burnout pattern detected (schedule rest)

---

## Setup Checklist

### iPhone Setup (2 minutes)
- [ ] Create "Send Health to Tempo" shortcut
- [ ] Add HealthKit permissions (Steps, Sleep, Heart Rate)
- [ ] Create Automation (11:00 PM daily)
- [ ] Test run the shortcut

### Mac Setup (Already done)
- [x] Create `/tempo/health/daily/` folder
- [x] Configure @tempo health reader
- [x] Set up analysis pipeline

---

## Security Note

- Health data stays **on-device**
- iCloud Drive sync is **end-to-end encrypted**
- @tempo only reads, doesn't write to Health
- You control frequency and data types

---

## Troubleshooting

### Shortcut not running?
- Check: Shortcuts app → Automation → Is it enabled?
- Check: iPhone Settings → Privacy & Security → Health → Shortcuts → Allowed?

### Data not appearing?
- Verify: iCloud Drive syncing (Settings → [Your Name] → iCloud → iCloud Drive)
- Check: Files app → iCloud Drive → tempo/health/daily/ folder exists

### Missing health permissions?
- iPhone Settings → Privacy & Security → Health → Shortcuts → Turn ON categories

---

## Advanced: Custom Data Points

Want to track custom things? Add these to your shortcut:

```
- Blood Oxygen (if Apple Watch)
- Body Temperature (if applicable)
- Caffeine (manual entry via shortcut form)
- Water intake (manual entry)
- Mood rating (1-10)
- Energy level (1-10)
```

---

**Ready to set up?**

Give me your iPhone and I'll guide you through creating the first Shortcut!
