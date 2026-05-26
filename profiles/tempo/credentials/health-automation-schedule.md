# Complete Health Relay Automation Setup for @tempo
# Optimized Schedule: 5 Daily Automations + Event Triggers

## 📅 DAILY AUTOMATION SCHEDULE

### Automation #1: MORNING BASELINE
**Trigger:** 8:00 AM (or Wake Up Alarm)
**Purpose:** Morning energy assessment + day optimization
**Data Captured:**
- Last night's sleep (hours, quality, deep sleep %)
- Morning heart rate (resting, HRV if available)
- Stand hours so far
- Yesterday's recovery metrics

**@tempo Actions:**
- "Sleep: 6.2 hrs (target 7-8). Deep work block shifted to 2 PM. Morning: easy admin tasks."
- If HRV low ↓ "Warning: Recovery compromised. Meeting-heavy day recommended."
- If HRV high ↑ "Green light: High cognitive capacity today. Move hard thinking to AM."

---

### Automation #2: PRE-DEEP-WORK (Changed from 1:45 → 12:00)
**Trigger:** 12:00 PM (before lunch/deep work block)
**Purpose:** Pre-focus energy check + midday course correction
**Data Captured:**
- Step count current (should be 3K+ by noon)
- Activity rings progress
- Heart rate trend
- Caffeine/water intake (if tracked)
- Stress indicators

**@tempo Actions:**
- Steps < 3,000: "Take walking lunch. Target: 5K by 2 PM."
- Rings behind: "Suggest 15-min walk before 2 PM block."
- Heart rate elevated: "Meeting at 2 PM - consider 10-min meditation first."
- Calendar check: "2-4 PM already blocked for deep work. Rings on track. Proceed."

---

### Automation #3: MIDDAY CHECK (Changed from 12:00 → 2:30)
**Trigger:** 2:30 PM (30 mins into deep work block)
**Purpose:** Energy maintenance + focus protection
**Data Captured:**
- Energy level (subjective, if logged)
- Heart rate (is it spiking from stress?)
- Focus duration (how long in deep work?)
- Stand reminder count
- Movement patterns

**@tempo Actions:**
- "30 mins into deep work. HR stable. Continue until 4 PM."
- "Standing alert triggered 3x. Take 5-min break, stretch, water."
- "Sedentary for 2 hours. Move or standing desk recommended."
- Protect this block: "No interruptions scheduled. Deep work protected."

---

### Automation #4: AFTER ENERGY (NEW - 5:00 PM)
**Trigger:** 5:00 PM (end of workday / transition to evening)
**Purpose:** Energy allocation for fun, chores, projects
**Data Captured:**
- All ring closure status (Move/Exercise/Stand)
- Current energy level
- Stress accumulation
- Steps needed for goal
- Workout completion today

**@tempo Actions:**
- Rings closed: "Achievement unlocked! Reward: guilt-free leisure time."
- Rings close behind: "30-min walk = ring closure + mental reset before evening."
- High stress: "Low-energy evening recommended. Pick: TV, book, or light hobby."
- High energy: "Green energy! Project time: coding, guitar, side hustle."
- House chores: "20-min tidy session will close Stand ring. Then: fun."

**Context-Aware Suggestions:**
- If Friday + rings closed: "Weekend mode activated."
- If weekday + unfinished tasks: "30-min power session? Or defer to tomorrow AM?"

---

### Automation #5: EVENING WIND-DOWN (Changed from 10:00 → 9:00)
**Trigger:** 9:00 PM (before 10 PM sleep target)
**Purpose:** End-of-day summary + tomorrow prep + sleep hygiene
**Data Captured:**
- Final step count
- Ring closure status (final attempt)
- Sleep readiness (screen time, heart rate trend)
- Mindful minutes
- Tomorrow's calendar overview

**@tempo Actions:**
- "Rings: 2/3 closed. 500 steps = complete. 5-min walk or skip?"
- Sleep prep: "HR trending down. Good sign. Sleep by 10 PM on track."
- Screen time alert: "30+ mins of screen time past 8 PM. Consider bedtime story."
- Tomorrow preview: "Tomorrow: 3 meetings, 2-hour deep work block. Morning baseline at 8 AM."
- Affirmation: "Today: 8,432 steps, closed rings, 10 min meditation. Recovery: Excellent."

**Sleep Hygiene Protocol:**
- "9 PM: Begin wind-down. Dim lights, stop screens, light stretch."
- "9:30 PM: Final check. Phone on charger, alarm set, no more work."
- "10 PM: Sleep target. Good night!"

---

## 🔔 EVENT-BASED TRIGGERS (Maximize Context Awareness)

### Fitness Events
**Trigger:** Workout/Exercise Detected
**Action:** "Workout logged: 35 mins. Suggest 10-min recovery buffer before next meeting."

**Trigger:** Activity Ring Closed (Move/Exercise/Stand)
**Action:** "Ring closed! Current streak: 12 days. Protect this momentum."

**Trigger:** Stand Reminder Fires 3+ Times
**Action:** "Sedentary pattern detected. Take 5-min movement break now."

**Trigger:** Mindfulness Session Completed
**Action:** "Mental reset logged. Good timing - stress down 15%."

### Sleep Events
**Trigger:** Sleep Detected (via Sleep Focus or Watch)
**Action:** "Sleep onset: 10:15 PM. Tomorrow's wake time: 6:15 AM confirmed."

**Trigger:** Wake Up Alarm Stops
**Action:** "Morning baseline automation triggered. Checking recovery metrics..."

### Calendar Events
**Trigger:** 15 Mins Before Meeting
**Action:** "Meeting in 15 mins. Current HR: 85 bpm. Deep breaths."

**Trigger:** Meeting Starts
**Action:** If HR > 100: "Elevated stress detected at meeting start. Post-meeting recovery: 10 min walk?"

**Trigger:** Meeting Ends
**Action:** "Meeting complete. Stress: +12 bpm above baseline. Schedule buffer?"

### Location Events
**Trigger:** Arrive at Home
**Action:** "Home detected. Evening mode. Relaxation: Unlocked. Chores: Optional."

**Trigger:** Arrive at Gym
**Action:** "Gym mode activated. Pre-workout: Skip. Post-workout: Log + recovery time."

**Trigger:** Leave Work Location
**Action:** "Workday end: 5:15 PM. Commute: Podcast mode. Home arrival ETA: 6:00 PM."

### Time-Based Micro-Triggers
**Trigger:** 10:00 AM (if not moved)
**Action:** "Mid-morning check: Sedentary? Stand, stretch, 2-min walk."

**Trigger:** 3:00 PM (afternoon slump)
**Action:** "Energy check: HR stable? Consider walking meeting or coffee."

**Trigger:** 6:00 PM (dinner time)
**Action:** "Dinner window. Step count: 7K. Evening walk after eating = ring closure."

**Trigger:** 8:00 PM (screen time warning)
**Action:** "Screen time limit approaching. Wind-down begins at 9 PM."

---

## 📱 SETUP INSTRUCTIONS

### Step 1: Create Master Shortcut
Create ONE shortcut: "Health Relay → @tempo"

```
Actions:
1. Get Text (Ask "Which automation?") → Store in variable "TriggerType"
2. Get Current Date → Store in "Timestamp"

3. Get Health Sample: Step Count (Today)
4. Get Health Sample: Sleep Duration (Last Night)
5. Get Health Sample: Resting Heart Rate
6. Get Health Sample: Exercise Minutes (Today)
7. Get Health Sample: Stand Hours (Today)
8. Get Health Sample: Active Energy (Today)
9. Get Health Sample: Mindful Minutes (Today)

10. Create Dictionary:
    {
      "trigger_type": "[TriggerType]",
      "timestamp": "[Timestamp]",
      "time_of_day": "[Current Time]",
      "steps": "[Step Count]",
      "sleep_hours": "[Sleep Duration]",
      "avg_heart_rate": "[Resting Heart Rate]",
      "exercise_minutes": "[Exercise Minutes]",
      "stand_hours": "[Stand Hours]",
      "active_energy_cal": "[Active Energy]",
      "mindful_minutes": "[Mindful Minutes]",
      "rings_status": "Calculate: Move/Exercise/Stand"
    }

11. Save to File:
    - Service: iCloud Drive
    - Folder: /tempo/health/daily/
    - Filename: "health_[TriggerType]_[Current Date]_[Current Time].json"

12. Show Notification:
    - Title: "@tempo synced"
    - Body: "[TriggerType]: [Step Count] steps, [Heart Rate] bpm"
```

### Step 2: Create 5 Automations

**Automation #1: Morning Energy**
- Trigger: Time of Day → 8:00 AM
- Action: Run Shortcut "Health Relay → @tempo"
- Input: "morning_baseline"
- Ask Before Running: OFF

**Automation #2: Pre-Deep-Work**
- Trigger: Time of Day → 12:00 PM
- Action: Run Shortcut "Health Relay → @tempo"
- Input: "pre_focus"

**Automation #3: Midday Check**
- Trigger: Time of Day → 2:30 PM
- Action: Run Shortcut "Health Relay → @tempo"
- Input: "midday_status"

**Automation #4: Afternoon Energy**
- Trigger: Time of Day → 5:00 PM
- Action: Run Shortcut "Health Relay → @tempo"
- Input: "afternoon_allocation"

**Automation #5: Evening Wind-Down**
- Trigger: Time of Day → 9:00 PM
- Action: Run Shortcut "Health Relay → @tempo"
- Input: "evening_windown"

### Step 3: Event Triggers

**Workout Complete:**
- Trigger: Fitness Activity Completed
- Action: Run shortcut with input "workout_complete"

**Ring Closed:**
- Trigger: Activity Ring Closed
- Action: Run shortcut with input "ring_closed_[Move/Exercise/Stand]"

**Sleep:**
- Trigger: Sleep Focus Enabled
- Action: Run shortcut with input "sleep_detected"

**Wake:**
- Trigger: Wake Up Alarm Stopped
- Action: Run shortcut with input "wake_detected"

**Before Meeting:**
- Trigger: Calendar Event → 15 mins before any meeting
- Action: Run shortcut with input "pre_meeting"

**Home Arrival:**
- Trigger: Arrive at Home location
- Action: Run shortcut with input "home_arrival"

---

## 🎯 Expected Daily Data Flow

| Time | Trigger | Data Points | @tempo Decision |
|------|---------|-------------|-----------------|
| 8:00 AM | Wake | Sleep HR, recovery | Adjust AM schedule |
| 10:00 AM | Micro | Steps (2K?) | Walk reminder |
| 12:00 PM | Pre-focus | Steps (3K?), rings | Lunch + walk combo |
| 2:30 PM | Midday | Deep work check | Continue/protect block |
| 3:00 PM | Slump | Energy check | Coffee/walk suggestion |
| 5:00 PM | Afternoon | Ring status | Fun vs chores vs projects |
| 6:00 PM | Dinner | Steps (7K?) | Post-dinner walk? |
| 8:00 PM | Screen | Screen time | Wind-down start |
| 9:00 PM | Evening | Final metrics | Tomorrow prep + sleep |
| + Events | Workout, meetings, rings | Contextual | Real-time adjustments |

**Total: 9+ health syncs per day** (contextually aware, not overwhelming)

---

## 💡 Pro Tips

**Battery Optimization:**
- All triggers use cached HealthKit data (already tracked)
- Minimal processing: just read + write file (1-2 seconds)
- iCloud Drive sync: Background, efficient
- Impact: <2% battery/day

**Data Storage:**
- iCloud Drive: Encrypted end-to-end
- Mac storage: ~/.hermes/profiles/tempo/health/ (600 permissions)
- Retention: Keep 90 days, archive monthly

**Fallback:**
- If iPhone offline → data queues, syncs when back online
- If automation fails → manual run shortcut as backup
- If @tempo down → health.json files accumulate, process when back

---

**Ready to build the shortcuts on your iPhone?**