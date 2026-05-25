# Tempo Controller - Peak Performance Day Optimization

## Day Type Classifications

### PEAK_PERFORMANCE_DAY (Tuesday/Friday)
**Profile:**
- Custody: NO
- Work: OFFICE (can stay late until 5:30 PM)
- Tonal: 60 min full workout available
- Spouse: Home by 5:30 PM for couple time

**Optimal Schedule:**
```
6:00 AM  - Wake
6:15 AM  - TONAL 60-min (strength focus)
7:15 AM  - Commute (podcast/learning)
8:00 AM  - Office start (FOCUS MODE ON)
8:00-11:30 AM - Deep work (cognitive peak!)
11:30 AM - Lunch walk + sunlight
12:30 PM - Return to desk
1:00-3:00 PM - Meetings/coordination (admin valley)
3:00-5:00 PM - Strategic work (secondary peak)
5:30 PM  - Commute home
6:00 PM  - Home, wife arrives 5:30
6:00-8:00 PM - Couple time (golden hour)
8:00-10:00 PM - Personal projects / relax
10:00 PM - Bed
```

**Key Triggers:**
- IF Steps > 8000 AND Sleep > 7 hours → Energy HIGH
- IF current_hour == 8:00-11:30 → "Deep Work Mode"
- IF current_hour == 5:30 PM → "Date night opportunity?"

## iPhone Shortcuts Actions Reference

### Time-Based IFs
1. **Get Health Sample** → Steps (Today)
2. **Get Health Sample** → Sleep Hours (Yesterday)
3. **Get Health Sample** → Heart Rate (Today)
4. **Create Dictionary** with health data
5. **If** Current Date between 8:00-11:30 AM → "PEAK COGNITIVE WINDOW"
6. **If** Steps > 8000 → "Energy HIGH"
7. **Run Shortcut** → "Tonal - Full Workout"
8. **Run Shortcut** → "Focus Mode - Deep Work"
9. **Show Notification** with recommendations
10. **Save to File** → analytics tracking

### Ultradian Break Reminder
- IF last_break > 90 minutes → "Take 15-min break"
- Options: Walk, Stretch, Water, Coffee

### Compound Optimization
- IF Energy == HIGH AND Time == 8:00-11:30 AM AND Meetings today < 2 → "⭐ OPTIMAL CONDITIONS"
- Run: "Elite Focus Mode" (blocks notifications)

## Energy Score Calculation

```
SleepScore = (SleepHours / 8) * 30
ActivityScore = (Steps / 10000) * 30
HeartScore = (90 - HeartRate) / 90 * 40
TotalEnergyScore = SleepScore + ActivityScore + HeartScore

IF TotalEnergyScore > 70 → "HIGH"
ELSE IF > 40 → "MEDIUM"
ELSE → "LOW"
```

## Evening Quality Time Protocol

**IF TimePhase == "Evening" AND Energy == HIGH:**
- Suggest: Restaurant date, project together, outdoor activity
- Ask: "What would you like to do tonight?"

**Options:**
1. Try new restaurant
2. Project together (smart home, shed)
3. Movie night at home
4. See friends
5. Just relax together

**IF Energy == LOW:**
- Early bed recommended
- Netflix + cuddle
- Skip heavy projects

## Burnout Prevention

**Triggers:**
- IF MeetingCount > 5 → "Meeting fatigue, protect tomorrow"
- IF SleepHours < 6 AND day == Wednesday → "Sleep debt! Prioritize rest"
- IF consecutive_work_days > 4 → "Recovery weekend approaching"

## Custody-Aware Scheduling

Use conditional logic based on custody status:
- IF custody_today == "YES" → Protect 6:30 AM bus, 3:30 PM pickup
- IF custody_today == "NO" → 5:30 PM couple time protected

## Tonal Integration

**Workout Types:**
- Peak days (Tue/Fri): 60 min full strength program
- Split days (Mon): 30 min express (one muscle group)
- Remote parent days: 45-60 min while daughter at school

**Recovery Check:**
- IF workout_completed yesterday AND Energy < MEDIUM → Skip today, prioritize rest
