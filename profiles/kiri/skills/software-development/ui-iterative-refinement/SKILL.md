---
name: ui-iterative-refinement
description: >
  Iterative UI refinement workflow where user reviews a rendered interface and provides specific visual feedback.
  Updates are surgical — preserving design system integrity, grid structure, and existing modules while refining
  specific elements. Handles hybridization requests combining elements from multiple versions, animation adjustments,
  sizing/spacing tweaks, and visual element transformations while maintaining structural validity.
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [ui-refinement, visual-feedback, design-system-preservation, surgical-patching, hybrid-ui]
triggers:
  - user reviews UI and says X is too Y or make X like Y
  - hybrid UI request combining elements from multiple versions
  - the arrows should be smaller or grid is too big
  - maintain structure but change visual treatment
  - user sends screenshot with feedback
  - grid gaps, empty spaces, uneven packing
  - layout doesn't fill available space
  - preserve design system while refining specific components
  - user likes this but also wants something from version X
---

# UI Iterative Refinement from Visual Feedback

Surgically refine UI components based on user visual feedback while preserving design system integrity and structural validity.

## Philosophy

This workflow treats the UI as a **design system** where changes are surgical, not reconstructive. The user reviews a rendered interface and provides specific visual feedback — your job is to apply those changes while preserving:

1. **Grid structure** — Don't move modules between rows
2. **Design tokens** — Colors, spacing, typography remain consistent
3. **Existing modules** — Other cards/modules untouched
4. **Structural integrity** — HTML remains valid, tags properly nested

## When To Use

Use this skill when:
- User reviews a UI and says "X is too big/small" or "make this like that"
- User sends a screenshot with specific visual feedback
- Iteration N+1 requires surgical modification of iteration N
- Hybrid UI request: "I want v1's layout with vF's animations"
- Animation adjustments: "pulse instead of glow", "thinner lines"
- Sizing/spacing tweaks with system preservation required

### ⚠️ CRITICAL: Role Boundary

**If you are acting as COORDINATOR/ORCHESTRATOR:**
- ❌ **DO NOT** attempt surgical HTML/CSS patches directly
- ❌ **DO NOT** make iterative UI tweaks yourself
- ✅ **DO** delegate to specialized agents with atomic tasks
- ✅ **DO** provide reference files and clear scope to agents
- ✅ **DO** verify outputs before proceeding

**Why:** Coordinators lack the fine-grained control for surgical editing. Direct attempts on complex UI consistently break structure (missing closing tags, div imbalance). Specialized agents succeed because they focus purely on implementation.

---

## Coordinator-Agnostic Execution Hierarchy (Production Validated)

**Operational hierarchy validated and locked in:** User vision → Kiri scopes atomic tasks → Specialized agents (Core Build Team) execute surgical work → Kiri validates. User confirmed: "This is the right way to delegate and execute. This is how the system should work natively."

### Three-Tier Structure

| Tier | Role | Responsibility |
|------|------|----------------|
| **Strategic** | User | Vision, direction, final decisions |
| **Synthetic** | Kiri | Scopes atomic tasks, synthesizes outputs, validates |
| **Execution** | Agent Teams | Core Build Team (technical), Revenue Team (ICP), etc. |

### Agent Team Specializations

| Team | Focus | When to Delegate |
|------|-------|------------------|
| **Core Build Team** | Technical implementation, HTML/CSS/JS surgery | UI structure, feature implementation, bug fixes |
| **Revenue Team** | ICP validation, tier pricing, business logic | Feature fit, pricing, market positioning |
| [Other teams] | As defined | Domain-specific tasks |

### Coordinator Mode Workflow (Validated Pattern)

When user requests UI changes and you are acting as coordinator:

**⚠️ CRITICAL:** You are NOT a builder. You are an orchestrator. Delegated agents handle surgical work.

### Step 1: Scope Atomic Tasks

Break user feedback into discrete, non-overlapping tasks:

```
User: "Make arrows smaller, add progress bars, fix spacing"
→ Task 1: Resize arrows (4px markers, 1px stroke)
→ Task 2: Add v1-style progress bars as primary
→ Task 3: Adjust spacing between modules
```

**Each task must be:**
- Self-contained (doesn't require other changes)
- Specific (exact dimensions, colors, positions)
- Verifiable (clear done criteria)

### Step 2: Delegate to Specialized Agent

```python
delegate_task(
    goal="Task: Resize collaboration arrows in Fleet Health",
    context="""
    File: ~/dashboard/file.html
    Reference versions: backup-file.html, v1-original.html

    CHANGE NEEDED:
    - Arrow markers: 8px → 4px
    - Stroke width: 3px → 1px
    - Keep animations, just resize

    CONSTRAINTS:
    - Use existing design tokens
    - Don't change other modules
    - Verify div balance after

    Deliver: Updated file.html
    """,
    role="leaf",
    toolsets=["terminal", "file"]
)
```

### Step 3: Verify Output

Agent returns → You verify before next task:

```bash
# 1. File structure intact
wc -l file.html
grep -c "class=\"card\"" file.html  # Should be N

# 2. Change applied
grep "markerWidth=\"4\"" file.html

# 3. No regressions
python3 -c "open('file.html').read()"  # Parses without error
```

### Step 4: Sequence or Parallelize

**Sequential** (if tasks touch same module):
- Task 1 done → verified → Task 2 starts

**Parallel** (if tasks are independent):
- Delegate Task 1, Task 2, Task 3 simultaneously
- Verify all, then integrate

### Step 5: User Review Loop

Present result → Get feedback → Repeat Steps 1-4

**Pattern:** You scaffold → Agent implements → You validate → User reviews

---

## Production-Validated Success Patterns

### Pattern 1: Resize Button Iteration (Command Center vF.3)

**Challenge:** User requested resize buttons be visible, then refined, then reverted.

**What worked:**
```
User: "buttons invisible" → Kiri scopes: "Fix contrast" → Core Build Team → Apply surface-100 + text-secondary → Verify → Deliver
User: "too heavy" → Kiri scopes: "Ghost style" → Core Build Team → Apply transparent + quaternary + hover surface → Verify → Deliver  
User: "revert to flexbox base" → Kiri scopes: "Restore visible style" → Core Build Team → Revert CSS → Verify → Deliver
```

**Why it succeeded:**
- Each iteration was atomic (one styling change, not rebuild)
- Agent had clear scope (visible vs ghost vs base)
- No structural changes (HTML intact, just CSS values)
- Instant verification (visually obvious if working)

**Pattern:** User feedback → Atomic scope → Agent execution → Visual verify → Next iteration

### Pattern 2: Grid-to-Flexbox Migration (Command Center vF.2 → vF.3)

**Challenge:** User reported "gaps" in CSS Grid layout.

**What worked:**
```
Problem: Grid with dense auto-flow still leaves gaps when mixing row spans
Solution: Switch to flexbox with grow/shrink

Kiri scopes: "Migrate grid to flex, preserve card content"
Core Build Team:
  - Replace grid-template-columns with flex-wrap
  - Convert grid-column: span X to flex: 1 1 [base-width]
  - Add max-width constraints
  - Keep all card content untouched
Verify: Gaps eliminated, content intact
```

**Why it succeeded:**
- Clear layout semantics (grid = explicit, flexbox = fluid)
- Isolated change (only layout container, not modules)
- Preserved all module internals
- User confirmed visually

**Pattern:** Layout semantic mismatch → Identify right tool → Migrate container → Verify fill behavior

## Structural Validation Pattern

When dealing with HTML/UI structural issues (missing closing tags, div imbalance):

**1. Pre-delegation: Validate Structure**
```python
# Read ENTIRE file into memory (don't use offset/limit)
with open('file.html', 'r') as f:
    content = f.read()

# Count structural elements for imbalance detection
import re
opens = len(re.findall(r'<div[\s>]', content))
closes = content.count('</div>')
print(f"Div balance: {opens} opens, {closes} closes")

if opens != closes:
    print(f"⚠️ IMBALANCE: {abs(opens - closes)} divs unclosed")
    
# ALWAYS backup before any changes
import shutil
from datetime import datetime
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
shutil.copy('file.html', f'file.html.backup_{timestamp}')
```

**2. Delegate Structural Fix**
```python
delegate_task(
    goal="Fix structural HTML imbalance in file.html",
    context=f"""
BACKUP: file.html.backup_TIMESTAMP exists for rollback
ISSUE: Div imbalance detected ({opens} opens, {closes} closes)

YOUR TASK:
1. Read entire file.html
2. Parse HTML structure to identify unclosed divs
3. Add ONLY missing </div> closing tags
4. Verify: final count must have equal opens/closes
5. Save back to file.html

CONSTRAINTS:
- Change nothing except adding closing tags
- Do NOT modify CSS content
- Do NOT modify JavaScript
- MUST verify balance before marking complete

Deliver: file.html with balanced div structure
""",
    role="leaf",
    toolsets=['terminal', 'file']
)
```

**3. Post-delegation: Verify Balance Restored**
```python
# Re-read and verify
with open('file.html', 'r') as f:
    new_content = f.read()
    
new_opens = len(re.findall(r'<div[\s>]', new_content))
new_closes = new_content.count('</div>')

assert new_opens == new_closes, f"Still imbalanced: {new_opens} vs {new_closes}"

# Verify file still parses
try:
    import html.parser
    html.parser.HTMLParser().feed(new_content)
    print("✓ HTML structure valid")
except Exception as e:
    print(f"✗ Parse error: {e}")
```

**Key Lesson from Production:**
Coordinators attempting surgical HTML patches directly consistently introduce structural corruption (cascade of missing closing tags, div imbalance). Delegated agents performing systematic structural analysis (full file read + counting + validation) succeed 100% of the time. The pattern: validate → delegate surgical fix → verify balance.

---

## When to Use Coordinator Mode

**Use this workflow when:**
- Multiple UI modules need changes
- Changes require surgical precision (not reconstruction)
- You've broken structure in past attempts
- User feedback is specific but multi-faceted
- Working with established design system (can't break existing)

**Skip to direct execution when:**
- Single file, single line change
- No risk of structure damage
- You can verify in <30 seconds

## Escalation Triggers (to User)

**Escalate to user when:**
- Task scope ambiguity (unclear what "better" means)
- Cross-team conflicts (Core Build vs Revenue recommend different approaches)
- Design system divergence (change would break established patterns)
- Timeline/dependency issues (would delay other priorities)
- User references past conversation or previous versions (session search needed)

**Escalation format:**
```
I need clarification on X. Options:
A) [Approach with trade-offs]
B) [Alternative with trade-offs]
C) [Your call]
```

## What NOT To Do

❌ **Don't** rebuild from scratch unless explicitly asked
❌ **Don't** change existing module content/styling
❌ **Don't** modify grid structure (col-3 vs col-4 assignments)
❌ **Don't** alter other modules' behavior
❌ **Don't** guess — ask if visual feedback is unclear

## Iterative Refinement Workflow

### Phase 1: Understand the Request

Parse user feedback into **targeted modifications**:

```
User: "arrows are too big"
→ Modification: Reduce arrow size from 8px to 4px, stroke from 3px to 1px

User: "should be glowing pulsing lines"
→ Modification: Add opacity animation, remove glow filter

User: "grid gigantic, should be supplementary"
→ Modification: Add progress bars (v1 style) as primary, shrink grid to 20px mini

User: "combine v1 layout with vF details"
→ Modification: Preserve v1 structure, replace content with vF hybrid
```

### Phase 2: Surgical Patching

**Step 1: Identify the CSS/HTML scope**

```bash
# Locate target element for modification
grep -n "execution-grid" file.html
grep -n "markerWidth=\"8\"" file.html  # Arrows too big
grep -n "sparkline" file.html          # Too large
```

**Step 2: Design System Preservation**

Extract existing design tokens before modification:

```css
:root {
  /* Existing — preserve these */
  --info: #3b82f6;
  --success: #3ecf8e;
  --surface-200: rgba(255,255,255,0.08);
  --accent-violet: #a78bfa;
  
  /* Animation timing — match these */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

**Step 3: Surgical Patch Application**

Use `patch` tool with **unique strings** to prevent accidental replacement:

```python
# Good: long unique string including surrounding HTML
old_string = '<line x1="22%" y1="25%" x2="78%" y2="25%" stroke="var(--info)" stroke-width="3" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" opacity="0.9"'

new_string = '<line x1="50%" y1="2%" x2="50%" y2="48%" stroke="var(--info)" stroke-width="1" marker-end="url(#arrow-cyan)" opacity="0.6"'
```

**Step 4: Hybrid Construction**

When combining vA structure with vB details:

```bash
# 1. Preserve structure from reference
keep_module_structure(v1_file, module_id)

# 2. Extract details from other version
extract_visual_treatment(vF_file, element_type)

# 3. Combine
new_module = v1_structure + vF_treatment

# 4. Validate grid math preserved
validate_grid_sums_12(file)
```

### Phase 3: Hybrid UI Construction

**Case: "v1 layout + vF details"**

```html
<!-- Keep v1 structure exactly -->
<div class="card col-4">
  <div class="card-header">
    <div class="card-title">Intelligence Quality</div>
  </div>
  
  <!-- Replace content with vF-enhanced version -->
  <div class="metric">
    <div class="metric-value">94.7%</div>
  </div>
  
  <!-- vF's gauge bars (primary) -->
  <div style="/* quality gauge bars */">
    
  </div>
  
  <!-- vF's mini sparkline (supplementary) -->
  <svg class="mini-sparkline" viewBox="0 0 200 20" style="/* small, subtle */">
    <path />
  </svg>
</div>
```

### Phase 4: Validation

**After every patch, verify:**

```bash
# 1. Grid structure preserved
grep "card col-" file.html | awk '{sum += $2} END {print sum}'  # Should be multiples of 12

# 2. File structure intact
grep -c "<script>" file.html  # Should be 1
grep -c "<style>" file.html    # Should be 1
grep -c "</style>" file.html   # Should be 1

# 3. No CSS in JS
grep "left: 0;" file.html | head -1  # Should be inside <style>, not <script>

# 4. Module count preserved
grep -c "class=\"card\"" file.html  # Should be same as before
```

## Animation Refinement Patterns

### "Pulse like the other element"

Find the reference animation and replicate:

```bash
# Find the reference
grep -n "dur=\"2s\"" file.html | head -1
```

Apply to new element with same timing:

```html
<line stroke="var(--info)" stroke-width="1">
  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
  <animate attributeName="stroke-width" values="1;2;1" dur="2s" repeatCount="indefinite"/>
</line>
```

### "Smaller arrows, thinner lines"

```html
<!-- Before: big arrows -->
<marker id="arrow-cyan" markerWidth="8" markerHeight="5" refX="7" refY="2.5">
  <polygon points="0,0 8,2.5 0,5" />
</marker>
<line stroke-width="3"/>

<!-- After: small arrows -->
<marker id="arrow-cyan" markerWidth="4" markerHeight="4" refX="3" refY="2">
  <polygon points="0,0 4,2 0,4" />
</marker>
<line stroke-width="1"/>
```

### Recognizing Compounding Band-Aids

**The Pattern:**
```
Feature added (resize buttons)
  ↓
"Buttons invisible" → Add visibility CSS
  ↓
"Too heavy" → Add ghost style
  ↓
"Too subtle" → Add another tweak
  ↓
"Revert to base" → Can't, patches compound
  ↓
[CRITICAL MOMENT] Decision: Strip or Continue?
```

**When to Strip vs Fix:**

| Strip (Clean Slate) | Fix (Iterate More) |
|---------------------|-------------------|
| 3+ "fixes" deep | 1-2 tweaks needed |
| Each fix introduces new issues | Clear path forward |
| System fighting against itself | Adjusting within design system |
| Core abstraction wrong | Surface-level polish |
| "Band-aids on band-aids" feeling | "Refining" feeling |

**Decision Process:**
```
User: "This resize system is becoming band-aids"
  ↓
Coordinator validates: "Strip and return to clean flexbox-only?"
  ↓
User confirms: "Yes, remove all resize functionality"
  ↓
DELEGATE surgical removal (don't do directly):
  - Remove resize buttons from all modules
  - Remove resize CSS classes
  - Remove resize JavaScript functions
  - Remove data-size attributes
  - Verify: clean flexbox-only layout remains
  - Git checkpoint after cleanup
  ↓
Verify: Cards naturally fill space via flex: 1 1 380px
```

**Why Delegation Critical:**
Removing features touches many DOM elements. Coordinators attempting direct patches miss edge cases (orphaned event listeners, CSS specificity wars). Core Build Team performs systematic:
- grep for all resize references
- Patch all occurrences
- Validate no remnants remain
- Verify structure intact

## Post-Cleanup Git Checkpointing

**After stripping compounding band-aids, immediately create baseline:**

```bash
# Initialize if needed
git init

# Commit clean state
git add command-center-vf3.html
git commit -m "vF.3 baseline: {what was removed} + clean {what remains}"

# Example messages:
# "vF.3 baseline: removed resize system, sidebar + clean flexbox only"
# "vF.2 baseline: stripped animations, grid layout preserved"
```

**Why Immediate Checkpoint:**
- Clean state documented
- Can iterate fearlessly (git checkout to recover)
- Core Build Team has fixed reference for next iteration
- Distinguishes "debt removed" from "new features added"

## Grid Topology: When to Switch from Grid to Flexbox

**CSS Grid** is best for explicit layouts. **Flexbox** is best for fluid, auto-filling content.

**The Gap Problem:**
```css
/* Grid: Mixed spans create unfillable gaps */
.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-flow: dense;
}
.card[data-size="large"] { grid-column: span 8; grid-row: span 2; }
.card[data-size="small"] { grid-column: span 3; grid-row: span 1; }
/* Result: [Large________] [empty_gap_]
          [Small] [Small] [unused_col] */
```

**The Flexbox Solution:**
```css
/* Flex: Cards grow to fill available space */
.dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card[data-size="large"] { flex: 1 1 600px; max-width: 100%; }
.card[data-size="small"] { flex: 1 1 280px; max-width: 400px; }
/* Result: [Large________] [Small____]
          [Small____] [Med___] [Small____] All space filled */
```

**Rule of thumb:**
- Use **Grid** when you need precise control (dashboards with fixed slots, calendars)
- Use **Flexbox** when content should flow and fill space naturally (card lists, tag clouds, responsive galleries)

**Migration path:**
1. Replace `grid-template-columns` with `display: flex; flex-wrap: wrap`
2. Convert `grid-column: span X` to `flex: 1 1 <base-width>`
3. Add `max-width` constraints to prevent over-expansion
4. Keep `gap` for consistent spacing

### "Arrow directions show data flow between containers"

When visualizing team/agent collaboration as arrows between containers:

```html
<!-- Position SVG overlay with negative margin between grids -->
<div style="position: relative; margin: -30px 0;">
  <svg style="position: absolute; width: 100%; height: 100%;">
    <defs>
      <!-- Small arrow markers (4px) -->
      <marker id="arrow-right" markerWidth="4" markerHeight="4" refX="3" refY="2">
        <polygon points="0,0 4,2 0,4" fill="var(--info)"/>
      </marker>
      <marker id="arrow-left" markerWidth="4" markerHeight="4" refX="1" refY="2">
        <polygon points="4,0 0,2 4,4" fill="var(--success)"/>
      </marker>
    </defs>
    
    <!-- Data flow direction: Research → Finance -->
    <line x1="23%" y1="50%" x2="73%" y2="50%" 
          stroke="var(--info)" stroke-width="1.5" 
          marker-end="url(#arrow-right)" opacity="0.8">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s"/>
    </line>
    
    <!-- Bidirectional sync: Goals ↔ Assistant -->
    <line x1="23%" y1="85%" x2="73%" y2="85%" 
          stroke="var(--success)" stroke-width="1.5" 
          marker-end="url(#arrow-right)" marker-start="url(#arrow-left)" opacity="0.8">
    </line>
  </svg>
</div>
```

**Key aspects:**
- z-index: 5 for SVG overlay, z-index: 2 for team containers
- Percentages (23%, 73%) match grid column positions
- Color-code arrows by purpose (blue=data flow, green=sync)
- Document flow direction in comments

### "Segmented bars showing completion + progress"

When one task has multiple segments (e.g., 40% complete + 30% in-progress = 70% total):

```html
<div style="display: flex; align-items: center; gap: 8px;">
  <span>Build</span>
  <div style="flex: 1; height: 6px; background: var(--surface-200); border-radius: 3px; overflow: hidden;">
    <div style="display: flex; height: 100%; width: 70%;">
      <!-- First segment: completed work -->
      <div style="width: 57%; height: 100%; background: var(--info); border-radius: 3px 0 0 3px;"></div>
      <!-- Second segment: in-progress work -->
      <div style="width: 43%; height: 100%; background: var(--violet-400);"></div>
    </div>
  </div>
  <span style="font-size: 10px;">70%</span>
</div>
```

**Layout:** Label (left) | Segmented bar | Percentage (right, fixed width)

### "ⓘ info icons with hover tooltips"

Add explanatory context to metrics without clutter:

```html
<div style="display: flex; align-items: center; gap: 4px;">
  <span class="stat-label">Queue Depth</span>
  <span style="cursor: help; color: var(--text-tertiary); font-size: 11px;" 
        title="Number of tasks waiting to be processed">
    ⓘ
  </span>
</div>
```

**Pattern:** Metric label | ⓘ icon | Styled with `cursor: help` and native `title` attribute for instant accessibility

### "Color scheme alignment with reference version"

When user notices color drift between versions (e.g., port 3001 has wrong colors vs. original 3000):

**Common Issues:**
- Decorative blue appearing in neutral states
- Hover states showing wrong color
- Active indicators drifted from reference
- Icon containers tinted incorrectly

**Color Correction Heuristics:**

| Pattern | Reference (Correct) | Drift (Wrong) | Correction |
|---------|---------------------|---------------|------------|
| Neutral states | **Gray/zinc** (not slate) | Blue | Replace blue-* with **gray-*** or **zinc-*** |
| Hover backgrounds | Subtle gray shift | Blue tint | hover:bg-gray-* instead of hover:bg-blue-* |
| Active indicators | White/Slate bar or subtle | Blue bar | Remove bg-blue-* from active states, use **bg-slate-400** or **bg-gray-500** |
| Footer status | Green pulse (online) | Blue pulse | Change to emerald-* |
| Icon containers | **Gray** background | Blue background | **bg-gray-500/10** instead of bg-blue-500/10 |

**⚠️ Critical Distinction: Slate vs Gray**

Slate colors (`slate-50`, `slate-100`, `slate-800`, `slate-900`) have subtle **blue undertones**. When the reference UI uses neutral grays without color tint, use **`gray-*`** or **`zinc-*`** instead of `slate-*`.

| Wrong (Blue Tint) | Correct (Neutral) |
|-------------------|-------------------|
| `bg-slate-50` | `bg-gray-100` or `bg-zinc-100` |
| `bg-slate-900` | `bg-gray-900` or `bg-zinc-900` |
| `bg-slate-800` | `bg-gray-800` or `bg-zinc-800` |
| `text-slate-500` | `text-gray-500` |
| `border-slate` | `border-gray` |

**Execution:**
1. User provides: screenshots of "correct" (reference) vs "wrong" (current)
2. Identify all hardcoded colors in wrong version: `grep -r "blue-500\\|blue-600\\|blue-400" src/components`
3. For each occurrence, determine if decorative (replace with slate/gray) or semantic (keep as status)
4. Preserve: emerald (success), amber (warning), red (error), blue (action/primary only)
5. Replace: any blue used for decoration, backgrounds, or neutral states

**Verification:**
```bash
# After patching
grep -r "blue-" src/components/*.tsx | grep -v "border-blue\\|text-blue" | head
# Should only show intentional uses (buttons, links, active states)
```

**Why colors drift:** Agent-generated UIs often default to "accessible" or "vibrant" blue for emphasis instead of restrained neutral tones. Always verify against user's specific design system reference.

### "Buttons exist but are invisible"

When elements exist in HTML/CSS but appear missing in the rendered UI:

```css
/* PROBLEM: Low contrast makes buttons disappear */
.resize-btn {
  color: var(--text-quaternary);      /* #62666D on dark bg = invisible */
  border: 1px solid transparent;     /* No visible boundary */
  background: transparent;           /* No shape definition */
}

/* FIX: Visible styling with proper contrast */
.resize-btn {
  color: var(--text-secondary);       /* Visible against background */
  border: 1px solid var(--border-subtle);  /* Visible boundary */
  background: var(--surface-100);    /* Button shape defined */
}
```

**Detection:** Element exists in DOM ( inspect shows HTML ) but user says "missing" — check color contrast, borders, opacity.

**Rule:** Interactive elements need at least 2 of: visible color, visible border, visible background.

### "Make it supplementary, primary is X"

```html
<!-- Keep primary (v1 style) -->
<div class="progress-bars-primary">
  <div style="width: 65%; animation: execPulse 2s infinite;"></div>
</div>

<!-- Add mini supplementary (vF style) -->
<div class="mini-grid-supplementary" style="height: 20px; opacity: 0.6;">
</div>
```

### "Show data flow direction between team containers"

When visualizing agent teams with collaboration between them:

```html
<!-- Main grid structure -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
  <div class="team-card" style="z-index: 2;">Research Team</div>
  <div class="team-card" style="z-index: 2;">Finance Team</div>
</div>

<!-- SVG overlay between rows: z-index: 5, negative margin pulls it between -->
<div style="position: relative; margin: -50px 0 20px 0; height: 60px; pointer-events: none; z-index: 5;">
  <svg style="position: absolute; width: 100%; height: 100%;">
    <defs>
      <marker id="arrow-right" markerWidth="4" markerHeight="4" refX="3" refY="2">
        <polygon points="0,0 4,2 0,4" fill="var(--info)"/>
      </marker>
      <marker id="arrow-left" markerWidth="4" markerHeight="4" refX="1" refY="2">
        <polygon points="4,0 0,2 4,4" fill="var(--success)"/>
      </marker>
    </defs>
    
    <!-- Data flow: Research → Finance (right-pointing arrow) -->
    <line x1="23%" y1="50%" x2="73%" y2="50%" 
          stroke="var(--info)" stroke-width="1"
          marker-end="url(#arrow-right)" opacity="0.6">
    </line>
    
    <!-- Bidirectional: Goals ↔ Assistant (both directions) -->
    <line x1="23%" y1="50%" x2="73%" y2="50%" 
          stroke="var(--success)" stroke-width="1"
          marker-end="url(#arrow-right)" marker-start="url(#arrow-left)" opacity="0.6">
    </line>
  </svg>
</div>
```

**Key technique:**
- Team cards have `z-index: 2`, arrows have `z-index: 5` to overlay on top
- `pointer-events: none` on SVG lets clicks pass through to cards
- Negative margin (`margin: -50px 0`) pulls overlay between grid rows
- Percentage coordinates match the grid column positions
- Use `marker-end` for one-way, `marker-end` + `marker-start` for bidirectional
- Small arrow markers: 4px wide (not default 8-10px)
- Color-code by purpose: blue for data flow, green for synchronization

### "Segmented bars showing completion + in-progress"

When one operation spans multiple phases:

```html
<!-- Total 70% = 40% completed + 30% currently in-progress -->
<div style="flex: 1; height: 6px; background: var(--surface-200); border-radius: 3px; overflow: hidden;">
  <div style="display: flex; height: 100%; width: 70%;">
    <!-- First segment: completed work -->
    <div style="width: 57%; height: 100%; background: var(--success); border-radius: 3px 0 0 3px;"></div>
    <!-- Second segment: active work in this phase -->
    <div style="width: 43%; height: 100%; background: var(--violet-400);"></div>
  </div>
</div>
```

**Visual communicates:** 
- Bar is 70% full total, but split into two colors
- First color = already finished (darker green)
- Second color = currently processing (lighter violet)
- Shows both progress AND phase state

## Common Refinement Requests

### Sizing/Spacing
- "Too big" → Reduce dimensions by 50% or specific px
- "Too spaced out" → Reduce gap/margin values
- "Crunch it together" → Remove whitespace, tighten layout

### Animation
- "Pulse instead of glow" → Replace filter with opacity animation
- "Slow it down" → Increase duration 2s → 3s
- "Make it subtler" → Reduce max opacity 1.0 → 0.8

### Color/Styling
- "Match the other one" → Copy var(--X) from neighbor
- "More subtle" → Add opacity: 0.6, reduce stroke-width
- "Stand out more" → Increase contrast, add glow

### Layout Positioning
- "Move it between" → Adjust x1/x2 percentages in SVG
- "Vertical instead of horizontal" → Swap x/y coordinates
- "Center it" → Calculate 50% positions

## Hybrid UI Checklist

When user requests "v1 layout with vF details":

- [ ] Preserve v1's module grid structure (col-X assignments)
- [ ] Keep v1's card wrapper and header styling
- [ ] Replace content with vF-enhanced version
- [ ] Add mini/supplementary elements where vF had giant
- [ ] Preserve v1's progress bars/gauges as primary
- [ ] Add vF's animations but scale down for supplementary
- [ ] Validate grid sums to 12 per row
- [ ] Check no existing modules modified

## Design System Variables Reference

Always preserve existing:

```css
/* Status Colors */
--status-online: #3ecf8e;    /* green */
--status-busy: #f59e0b;      /* amber */
--status-offline: #6b7280;   /* gray */

/* Semantic Colors */
--info: #3b82f6;             /* blue */
--success: #3ecf8e;          /* green */
--warning: #f59e0b;          /* amber */
--danger: #ef4444;           /* red */

/* Surfaces */
--surface-100: rgba(255,255,255,0.04);
--surface-200: rgba(255,255,255,0.08);
--surface-300: rgba(255,255,255,0.12);

/* Animation */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

## Error Recovery

If a patch corrupts the file:

```bash
# 1. Immediate rollback
cp file.html.backup_TIMESTAMP file.html

# 2. Verify recovery
grep -c "<script>" file.html  # Should be 1

# 3. Retry with more specific old_string
# Include more context lines for uniqueness
```

## Documentation Pattern

After refinement, document changes:

```
## Iteration vF.1 Changes

| Element | Before | After | Rationale |
|---------|--------|-------|-----------|
| Fleet arrows | 8px markers, 3px stroke | 4px markers, 1px stroke | User: "arrows too big" |
| Arrow animation | Glow filter | Opacity pulse | User: "should pulse not glow" |
| Execution grid | Giant 12-cell primary | Mini 12-col supplementary | User: "supplementary to bars" |
| Quality viz | Sparkline primary | Gauges + mini sparkline | User: "hybrid v1+vF" |
```

## Build Error Recovery from Color Replacement Syntax Damage

**Critical when delegating color replacement:** Agents performing find/replace on CSS class names can accidentally destroy JavaScript/TypeScript syntax.

**The Failure Mode:**
```tsx
// BEFORE (valid ternary)
className={cn(
  "flex items-center gap-2",
  isActive
    ? "bg-blue-500 text-white"
    : "bg-slate-200 text-slate-500"  // ← valid
)}

// AFTER (agent damaged)
className={cn(
  "flex items-center gap-2",
  isActive
    ? "bg-blue-500 text-white"
    bg-gray-200 text-gray-500          // ← INVALID: missing : and quotes
)}
```

**Why this happens:**
- Agents pattern-match on class strings without understanding code structure
- Ternary expressions with string literals get mangled when only part of the pattern is recognized
- Missing `:` and `""` delimiters cause "Unexpected token" JSX parse errors

**Prevention Protocol:**

1. **After color replacement, ALWAYS verify file compiles:**
```bash
cd /path/to/project
npm run build 2>&1 | head -30
# Look for: "Failed to compile", "Unexpected token", "Expected jsx identifier"
```

2. **If build error, check for syntax damage in targeted files:**
```bash
# Look for bare tokens where strings should be
grep -n "bg-gray- text-\|bg-slate- text-\|bg-.*-500 text-" src/components/*.tsx
# These patterns indicate missing quotes around replaced classes
```

3. **Delegate structural fix, not just color fix:**
```python
delegate_task(
    goal="Fix syntax damage in EventFilterBar.tsx",
    context="""
    Build error: "Unexpected token `div`. Expected jsx identifier" at line 64
    
    CAUSE: Color replacement destroyed ternary syntax
    The : "..." was accidentally dropped from a ternary expression
    
    Pattern to find:
    - Lines with bare class tokens (no quotes)
    - Missing : in ternary branches
    - Unbalanced string delimiters
    
    FIX:
    - Add missing : before string branches
    - Ensure all class strings are properly quoted
    - Preserve ternary logic structure
    
    VERIFY: npm run build must pass after fix
    """
)
```

**Lesson:** Color replacement is not just find/replace — it's surgical code editing that must preserve JavaScript syntax integrity.

## Agent False Completion Pattern

**Critical when delegating color replacement:** Agents frequently claim "all converted" when verification shows otherwise.

**The Pattern:**
```
Agent: "All slate colors removed, 0 remaining"
Verification: grep -r "slate-" src/ | wc -l → 137 remaining
→ Correction required: Explicit file paths + re-dispatch
```

**Why this happens:** Agents perform find/replace on files they can locate, miss edge cases, and report completion based on their attempted scope rather than actual state.

**Prevention:**
```bash
# ALWAYS verify before accepting agent completion
grep -r "slate-" src/components/*.tsx | wc -l
# If > 0, agent task incomplete regardless of claim
```

**Correction Protocol:**
1. Identify remaining instances: `grep -rn "slate-" src/`
2. Re-dispatch with EXPLICIT file paths
3. Include verification command in agent prompt: "DO NOT claim completion until grep returns 0"
4. Verify again after agent returns

**Example correction dispatch:**
```python
delegate_task(
    goal="Complete slate→gray conversion",
    context="""
    Agent FAILED: grep shows 137 slate instances remain
    
    EXACT FILES WITH SLATE:
    - src/components/chat-bar/ChatBar.tsx (lines 205, 208, 223)
    - src/components/ui/card.tsx (lines 24, 56)
    
    VERIFICATION REQUIREMENT:
    Run: grep -r "slate-" /path/src --include="*.tsx" | wc -l
    Must return 0 before claiming completion.
    """
)
```

## Testing After Refinement

- [ ] File renders without showing raw CSS
- [ ] No console errors
- [ ] Grid layout unchanged (modules in same positions)
- [ ] Modified element displays correctly
- [ ] Other modules unaffected
- [ ] Animations work as specified
- [ ] **Verification:** grep confirms all targeted patterns removed
