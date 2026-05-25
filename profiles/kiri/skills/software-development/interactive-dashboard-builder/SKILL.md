---
name: interactive-dashboard-builder
description: >
  Build fully-functional Single Page Application dashboards with stunning Linear/Stripe aesthetic.
  Creates complete admin interfaces with multi-view navigation, modal systems, form handling,
  state management, and responsive design. Produces standalone HTML files or multi-page apps.
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [dashboard, spa, ui, javascript, interactive, admin, single-page-app]
triggers:
  - build a dashboard
  - create admin interface
  - dashboard showing raw CSS code instead of UI
  - multiple patch operations corrupted HTML structure
  - innerHTML destroys event listeners
  - make a control panel
  - dashboard with multiple views
  - build a command center
  - SPA dashboard
  - interactive admin ui
  - dashboard with modals and forms
  - buttons not working after navigation
  - innerHTML destroys event listeners
  - SPA section navigation broken
  - event delegation for dynamic content
  - agent team dashboard with health monitoring
  - command center with agent invocation
  - degradation detection dashboard
  - multi-team agent management UI
---

# Interactive Dashboard Builder

Build production-ready Single Page Application (SPA) dashboards with stunning aesthetics and full interactivity. This skill covers the complete journey from design system to working JavaScript implementation.

## What This Skill Does

Creates complete admin/control dashboards featuring:
- ⚡ **Multi-view navigation** - Sidebar or tab-based section switching
- 🎨 **Linear/Stripe aesthetic** - Dark mode, minimal, professional
- 💬 **Modal system** - Forms, details, confirmations
- 🔄 **State management** - JavaScript state with localStorage persistence
- 📊 **Data visualization** - Charts, progress bars, metrics
- 📱 **Responsive design** - Works on mobile to desktop
- 🎯 **Interactive elements** - Buttons, filters, forms, tables

## When To Use

Use this skill when you need:
- Admin dashboards with multiple sections/views
- Control panels for managing agents/systems
- CRUD interfaces (Create, Read, Update, Delete)
- Monitoring dashboards with real-time updates
- Multi-step workflows or wizards
- Settings/configuration panels
- Any SPA where the URL doesn't change but content does

## Architecture Pattern

```
Dashboard SPA Structure
├── Sidebar Navigation (sticky, section switcher)
├── Main Content Area (dynamic sections)
│   ├── Dashboard (overview/widgets)
│   ├── List Views (tables, cards, grids)
│   ├── Detail Views (single item focus)
│   └── Forms (create, edit)
├── Modal System (overlays, forms, confirmations)
├── State Manager (centralized data)
└── Notification System (toast messages)
```

## Implementation Steps

### Phase 1: Layout Foundation

1. **Grid Layout**
   ```css
   .app {
       display: grid;
       grid-template-columns: 240px 1fr;
       min-height: 100vh;
   }
   ```

2. **Sidebar (sticky, scrollable)**
   - Logo/brand at top
   - Navigation sections with icons
   - Active state highlighting
   - Collapsible on mobile

3. **Main Content Area**
   - Header with title + action buttons
   - Content sections (conditionally displayed)
 - Footer (optional)

### Phase 2: Section Manager

Create a SectionManager that handles view switching:

```javascript
const SectionManager = {
    currentSection: 'dashboard',
    sections: ['dashboard', 'agents', 'settings'],
    
    init() {
        this.createSections();
        this.bindNavigation();
    },
    
    createSections() {
        // Generate HTML for all sections, hide all but active
        sections.forEach(id => {
            const section = document.createElement('div');
            section.id = `section-${id}`;
            section.className = 'section';
            section.style.display = id === this.currentSection ? 'block' : 'none';
            section.innerHTML = this.getContentForSection(id);
            container.appendChild(section);
        });
    },
    
    show(sectionId) {
        // Update sidebar active state
        // Hide all sections
        // Show target section with animation
        this.currentSection = sectionId;
    }
};
```

⚠️ **CRITICAL PITFALL**: Using `innerHTML` to recreate sections destroys all event listeners. The buttons will appear but won't work. You have two solutions:

**Option A: Event Delegation (Recommended)**
Bind events at the document level so they work even when DOM elements are recreated:

```javascript
// Event delegation - survives DOM recreation
document.addEventListener('click', function(e) {
    // New Operation button
    if (e.target.closest('.header-actions .btn-primary')) {
        e.preventDefault();
        OperationManager.showCreateModal();
        return false;
    }
    
    // Agent cards (delegated)
    const agentCard = e.target.closest('.agent-card');
    if (agentCard) {
        const agentName = agentCard.querySelector('.agent-name')?.textContent?.trim();
        const agent = State.agents.find(a => a.name === agentName);
        if (agent) AgentManager.showDetail(agent);
    }
    
    // Operation items (delegated)
    const opItem = e.target.closest('.operation-item');
    if (opItem && !e.target.closest('.operation-actions')) {
        const opName = opItem.querySelector('.operation-name')?.textContent?.trim();
        const op = State.operations.find(o => o.name === opName);
        if (op) OperationManager.showDetail(op);
    }
}, true); // Use capture phase for reliability
```

**Option B: Re-bind After Navigation**
If you must use direct binding, re-bind after each section switch:

```javascript
show(sectionId) {
    // ...hide/show logic...
    
    // Re-bind all interactive elements for this section
    setTimeout(() => this.bindSectionElements(sectionId), 50);
}
```

**Recommendation**: Use Option A (Event Delegation) for dashboards that recreate DOM content. It's more robust and requires less code.

### Phase 3: Modal System

Create reusable modal overlay:

```javascript
const Modal = {
    open(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `\n            <div class="modal-backdrop">\n            <div class="modal-content">\n                ${options.title ? `<h3>${options.title}</h3>` : ''}\n                ${content}\n            </div>\n        `;
        document.body.appendChild(modal);
        
        // Bind close on backdrop click or ESC key
    },
    
    close() {
 document.querySelector('.modal-overlay').remove();
    }
};
```

CSS essentials:
```css
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--rounded-xl);
    padding: var(--spacing-xl);
    max-width: 500px;
    width: 90%;
}
```

### Phase 4: State Management

Centralized state with localStorage persistence:

```javascript
const State = {
    data: {},
    
    init(defaults) {
        this.data = { ...defaults, ...this.load() };
    },
    
    get(key) {
        return this.data[key];
    },
    
    set(key, value) {
        this.data[key] = value;
        this.save();
    },
    
    save() {
        localStorage.setItem('dashboardState', JSON.stringify(this.data));
    },
    
    load() {
        try {
            return JSON.parse(localStorage.getItem('dashboardState')) || {};
        } catch {
 return {};
        }
    }
};
```

### Phase 5: Notification System

Toast messages for user feedback:

```javascript
const Notifications = {
    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
 document.body.appendChild(toast);
        
        // Animate in, then auto-remove after 3s
        setTimeout(() => toast.remove(), 3000);
    }
};
```

### Phase 6: Form Handling

Standard form with validation:

```javascript
function handleFormSubmit(formId, onSuccess) {
    const form = document.getElementById(formId);
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        const errors = validate(data, form.dataset.rules);
        if (errors.length > 0) {
            showErrors(form, errors);
            return;
        }
        
        // Submit
        onSuccess(data);
        Modal.close();
        Notifications.show('Successfully saved!', 'success');
    });
}
```

## Design System Variables

```css
:root {
    /* Background Layers */
    --bg-primary: #0D0D0F;
    --bg-secondary: #151518;
    --bg-tertiary: #1E1E22;
    --bg-elevated: #25252A;
    --bg-hover: #2A2A30;
    
    /* Accents */
    --accent-primary: #6E56CF;
    --accent-secondary: #3ECF8E;
    --accent-tertiary: #F59E0B;
    --accent-danger: #EF4444;
    
    /* Status */
    --status-online: #3ECF8E;
    --status-busy: #F59E0B;
    --status-offline: #6B7280;
    
    /* Text */
    --text-primary: #FAFAFA;
    --text-secondary: #A1A1AA;
    --text-tertiary: #71717A;
    
    /* Spacing */
    --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 12px;
    --spacing-lg: 16px; --spacing-xl: 20px; --spacing-2xl: 24px;
    
    /* Radius */
    --rounded-md: 6px; --rounded-lg: 8px; --rounded-xl: 12px;
}
```

## Keyboard Shortcuts

Add keyboard navigation for power users:

```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        Modal.open(createForm, { title: 'New Item' });
    }
    if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        QuickActions.show();
    }
    if (e.key === 'Escape') {
        Modal.close();
    }
});
```

## Pattern: Replicate and Extend Layout

When users prefer an existing layout over a redesign, preserve the exact structure and add the new module seamlessly.

### When to Use This Pattern

- User: "Keep the layout but add X"
- User: "Match the existing structure exactly"
- Iterating on existing dashboard (not redesign from scratch)
- Adding modules to working dashboard

### Step-by-Step Replication

**1. Analyze Existing Grid**

Read the source HTML to identify grid structure:
```bash
# Extract all grid-column assignments
grep "class=\"card col" existing.html
```

Example output:
```
<div class="card col-4">  <!-- Agent Fleet -->
<div class="card col-4">  <!-- Parallel Execution -->
<div class="card col-4">  <!-- Intelligence Quality -->
<div class="card col-3">  <!-- Memory & KG -->
<div class="card col-3">  <!-- Market Intel -->
<div class="card col-6">  <!-- Team Orchestration -->
<div class="card col-3">  <!-- Quick Actions -->
```

**2. Map the 12-Column Grid**

```
Row 1: [col-4] [col-4] [col-4]     = 12 ✓
Row 2: [col-3] [col-3] [col-3] [col-3] = 12 ✓  
Row 3: [col-6] [col-3] [col-3]     = 12 ✓
```

**3. Identify Insertion Point**

Ask user: "Where should the new module go?"
- Same row? (replace col-3 with col-3+col-3? No, keep same)
- New row? (add col-X that fits remaining space)
- Replace existing? (which one?)

**4. Preserve ALL Styling**

Copy EXACTLY:
- Card structure: `.card` `.card-header` `.card-title` `.card-title-icon`
- Badge classes: `.badge-online` `.badge-busy`
- Status colors: `#0D0D0F`, `#6E56CF`
- Typography: `Inter` + `JetBrains Mono`
- Spacing: `var(--spacing-md)` etc.

⚠️ **CRITICAL:** Do not change ANY existing CSS. Only add new module CSS.

**5. Create New Module (Matching Style)**

```html
<!-- New Module -->
<div class="card col-3">
    <div class="card-header">
        <div class="card-title">
            <span class="card-title-icon">⟐</span>
            <span>Activity Feed</span>
        </div>
        <span class="card-badge badge-online">5</span>
    </div>
    <!-- Content matching existing card styles -->
</div>
```

**6. Validation Steps (with Grid Math Commands)**

Validate grid math programmatically:

```bash
# Extract and calculate grid layout
grep "card col-" file.html | sed 's/.*card col-\([0-9]*\).*/\1/' | awk '
BEGIN { row=1; total=0 }
{
    total += $1
    printf "  col-%d → %d total", $1, total
    if (total == 12) {
        print " ✓ [Row complete]"
        row++
        total=0
    } else {
        print ""
    }
}'

# Quick module count comparison
echo "v1: $(grep -c "card col-" v1.html) modules"
echo "v2: $(grep -c "card col-" v2.html) modules"
```

**Verify:**
- Grid sums to 12 per row (no overflows like 15 from 3+3+3+6)
- All existing modules unchanged
- New module visually consistent
- No breaking changes to CSS
- Original file preserved (v1, v2 naming convention)

**Common Grid Errors:**
- Adding col-3 to row-2 that's already 3+3+6 = 15 (overflow)
- Shrinking col-6 → col-3 module with internal 6-column CSS grid
- Missing closing tags that break row grouping

### Naming Convention for Iterations

```
command-center.html          # Original (v1)
command-center-v2.html       # Iteration (different layout)
command-center-v3.html       # Next iteration
```

Never overwrite v1. Always create new file for iterations.

> ## Common Mistakes to Avoid
>
> **❌ Don't:** Change existing grid structure
> **❌ Don't:** Modify existing module HTML/CSS
> **❌ Don't:** Use different card styling
> **❌ Don't:** Assume col-6 + col-6 when user wants col-4 + col-4 + col-4
>
> **✅ Do:** Match existing exactly
> **✅ Do:** Insert new module as peer
> **✅ Do:** Add only new module CSS
> **✅ Do:** Preserve original file
>
> ---
>
> ## Critical Pitfall: Wrong Data Source
>
> ### PC Hardware Metrics in App Dashboards
>
> **SCENARIO:** Building a Kiri Agent OS dashboard showing "System Metrics"
>
> **WRONG:** Displaying PC hardware stats (CPU, RAM, Disk)
> ```typescript
> // ❌ WRONG - Shows generic Linux system metrics
> async function getMetrics() {
>   const cpuInfo = await readFile('/proc/cpuinfo', 'utf-8');
>   const memory = await readFile('/proc/meminfo', 'utf-8');
>   const disk = await execAsync('df -h');
>   return { cpu: parseCpu(cpuInfo), memory: parseMem(memory), disk };
> }
> ```
>
> **USER FRUSTRATION SIGNAL:**
> > "Last version did that and I hated it."
> > "I want to make sure ... displaying real data from this Hermes system"
>
> **CORRECT:** Display application-specific metrics
> ```typescript
> // ✅ CORRECT - Shows agent fleet metrics
> async function getMetrics() {
>   const processes = await readFile('~/.hermes/state/processes.json');
>   const profiles = await scanDir('~/.hermes/profiles/');
>   const sessions = await countFiles('~/.hermes/profiles/*/sessions/');
>   return {
>     agents: { online: profiles.online, total: profiles.total },
>     activeTasks: processes.running.length,
>     recentSessions: sessions
>   };
> }
> ```
>
> **RULE:** 
> - **PC Hardware Metrics** = `/proc/*`, `df`, `mpstat`
> - **App/System Metrics** = Application state, process list, task queue, user sessions
>
> **WHEN IN DOUBT:** Ask user: "Should this show computer resources (CPU/RAM) or application state (agents/tasks)?"
>
> ---

## Debugging File Corruption

If the dashboard shows raw CSS/text instead of rendering, the HTML structure is broken. This commonly happens when patch operations accidentally merge CSS into JavaScript or leave tags unclosed.

**Symptoms:**
- Browser displays CSS code instead of the UI
- File missing `</script>` or `<style>` tags in correct places
- File accidentally truncated or concatenated during edits
- View Source shows CSS properties where JavaScript should be (e.g., `left: 0;` inside a function)

**Detection Commands:**
```bash
# Tag count check - each should return exactly 1
grep -c "<script>" file.html    # Should be 1
grep -c "</script>" file.html   # Should be 1  
grep -c "<style>" file.html     # Should be 1
grep -c "</style>" file.html    # Should be 1

# Check file ends properly
tail -5 file.html  # Should be: </style>\n</body>\n</html>

# Check file starts properly
head -15 file.html # Should start with <!DOCTYPE html>\n<html>

# Look for CSS leaking into JS (common corruption pattern)
grep -n "left: 0;" file.html  # If this appears INSIDE <script>, file is corrupted
```

**Real-World Corruption Example:**

A file corrupted by sequential patches might look like this at the transition point:

```javascript
// ============== INITIALIZATION ==============
function init() {
    bindDashboardButtons();
    bindAgentCards();
}

    // CSS accidentally injected here!!!
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
}

.modal-container {  // CSS continues without <style> wrapper
```

**Recovery Strategy:**

When multiple patch operations corrupt the file structure:

1. **Stop all edits** and create a timestamped backup:
   ```bash
   cp file.html file.html.corrupted_$(date +%Y%m%d_%H%M%S)
   ```

2. **Assess what you have**:
   ```bash
   # Find where the corruption starts
   grep -n "left: 0;" file.html              # CSS in wrong place
   grep -n "function init" file.html          # JS function locations
   grep -n "</script>" file.html | tail -1   # Last script close
   grep -n "<style>" file.html               # Style tag locations
   ```

3. **Find a clean checkpoint**:
   ```bash
   # List all backups sorted by time
   ls -lt file.html.backup_* 2>/dev/null || ls -lt *.html*
   
   # If available, check if an older backup renders correctly
   wc -l file.html.backup_*  # Compare line counts - corrupted often larger
   ```

4. **Manual extraction and rebuild** (if no clean backup exists):
   ```bash
   # Find the line where JS should end (before CSS starts)
   JS_END=$(grep -n "bindCompetitorCards" file.html | tail -1 | cut -d: -f1)
   
   # Extract JavaScript up to but not including the corruption
   head -n $((JS_END + 3)) file.html > cleaned.html  # +3 for closing braces
   
   # Add proper script closing
   echo "" >> cleaned.html
   echo "    // Start when DOM ready" >> cleaned.html
   echo "    if (document.readyState === 'loading') {" >> cleaned.html
   echo "        document.addEventListener('DOMContentLoaded', init);" >> cleaned.html  
   echo "    } else {" >> cleaned.html
   echo "        init();" >> cleaned.html
   echo "    }" >> cleaned.html
   echo "})();" >> cleaned.html
   echo "</script>" >> cleaned.html
   echo "" >> cleaned.html
   echo "<!-- Modal and Section Styles -->" >> cleaned.html
   echo "<style>" >> cleaned.html
   
   # Find where CSS actually starts (after the injected properties)
   CSS_START=$(grep -n "\.modal-container {" file.html | head -1 | cut -d: -f1)
   
   # Extract CSS from the real start
   tail -n +$CSS_START file.html >> cleaned.html
   ```

5. **Alternative: Rebuild from scratch** (if extraction is too complex):
   - Keep DESIGN.md as the source of truth
   - Use execute_code with write_file to generate a clean version
   - Re-apply only the necessary JavaScript functionality

**What Causes This Corruption:**

1. **Non-unique old_string in patch**: When the `old_string` appears multiple times in the file, patch may replace the wrong occurrence
2. **CSS leaking into JavaScript**: A patch targeting CSS accidentally includes lines that match within the `<script>` block
3. **Missing </script> before <style>**: File concatenation that merges script and style without proper closing
4. **Sequential patches on corrupted base**: Patching an already-corrupted file compounds the damage

**Prevention Best Practices:****

```bash
# 1. Backup BEFORE any series of patches
cp file.html file.html.backup_$(date +%s)

# 2. Check structure after EVERY patch
grep -c "</script>" file.html && grep -c "<style>" file.html

# 3. If count is wrong, STOP and restore from backup
cp file.html.backup_* file.html

# 4. For complex patches, use read_file to verify context first
#    to ensure old_string is unique
```

**When to Rebuild Instead of Repair:**

Repair is worth it when:
- You have a backup from <30 minutes ago with minimal changes
- The corruption is isolated to one section (script close/style open)
- The HTML structure is otherwise intact

Rebuild when:
- Multiple patches have corrupted multiple sections
- CSS is scattered throughout JavaScript
- No reliable backup exists
- Time to repair exceeds 30 minutes

## Degradation Detection Panel Pattern

Add a health monitoring section for proactive system quality monitoring:

```html
<!-- Degradation Health Panel -->
<div class="degradation-panel">
  <div class="degradation-header">
    <div class="degradation-title">
      <div class="degradation-icon">🛡️</div>
      <div>
        <h2>System Health Monitor</h2>
        <p>Degradation detection across all layers</p>
      </div>
    </div>
    <div class="health-score">
      <div class="health-score-value">98.2%</div>
      <div class="health-score-label">Overall Health</div>
    </div>
  </div>
  
  <div class="degradation-metrics">
    <div class="degradation-metric">
      <div class="degradation-metric-header">
        <div class="degradation-metric-icon">📝</div>
        <span>Prompt Quality</span>
      </div>
      <div class="degradation-metric-value good">97%</div>
      <div class="degradation-metric-bar">
        <div class="degradation-metric-fill" style="width: 97%; background: var(--success);"></div>
      </div>
    </div>
    <!-- Repeat for Data Integrity, Context Quality, Agent Performance -->
  </div>
</div>
```

**CSS for degradation panel:**
```css
.degradation-panel {
  background: linear-gradient(135deg, var(--surface-100) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border-standard);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.degradation-metric {
  background: var(--surface-200);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 16px;
}

.degradation-metric-value.good { color: var(--success); }
.degradation-metric-value.warning { color: var(--warning); }
.degradation-metric-value.error { color: var(--error); }

.degradation-metric-bar {
  height: 4px;
  background: var(--surface-400);
  border-radius: 2px;
  overflow: hidden;
}

.degradation-metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 300ms ease;
}
```

## Agent Invocation Panel Pattern

Fixed bottom-right panel for dispatching agents with task prompts:

```html
<!-- Fixed Invocation Panel -->
<div class="invocation-panel" id="invocation-panel">
  <div class="invocation-header">
    <div class="invocation-title">
      <span>⚡</span> Invoke Agent
    </div>
    <button class="invocation-close" id="close-invocation">×</button>
  </div>
  
  <div class="invocation-body">
    <div class="agent-selector">
      <label class="agent-selector-label">Select Agent</label>
      <select class="agent-select" id="agent-select">
        <option value="">Choose an agent...</option>
        <optgroup label="🔨 Create Team">
          <option value="Mason">🧱 Mason — Code Architect</option>
          <!-- More agents -->
        </optgroup>
        <!-- More teams -->
      </select>
    </div>
    
    <textarea class="prompt-input" id="prompt-input" 
      placeholder="Describe the task for this agent..."></textarea>
    
    <div class="invocation-actions">
      <button class="btn btn-secondary" id="cancel-invocation">Cancel</button>
      <button class="btn btn-primary" id="submit-invocation">
        <span>▶</span> Invoke Agent
      </button>
    </div>
  </div>
</div>
```

**JavaScript for invocation:**
```javascript
function submitInvocation() {
  const agent = document.getElementById('agent-select').value;
  const prompt = document.getElementById('prompt-input').value.trim();
  
  if (!agent || !prompt) {
    alert('Please select an agent and enter a task');
    return;
  }
  
  // Simulate cronjob invocation
  const command = `cronjob(action="run", skills=["${agent}"], prompt="${prompt.slice(0, 100)}...")`;
  console.log('[Invocation]', command);
  
  // Add to activity log
  addLog('success', `Invoked ${agent} with task`);
  
  // Clear and close
  document.getElementById('prompt-input').value = '';
  toggleInvocationPanel(false);
}

// Toggle panel visibility
function toggleInvocationPanel(show) {
  document.getElementById('invocation-panel').style.display = show ? 'block' : 'none';
}

// Open from header button or per-agent buttons
document.getElementById('invoke-btn').addEventListener('click', () => toggleInvocationPanel(true));
document.querySelectorAll('.invoke-agent-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const agentId = e.target.closest('.agent-card').dataset.agent;
    document.getElementById('agent-select').value = agentId;
    toggleInvocationPanel(true);
  });
});
```

## Agent Team Organization Pattern

Organize agents by teams with team-colored badges:

```javascript
const AGENTS = {
  create: [
    { id: 'Mason', name: 'Mason', emoji: '🧱', role: 'Code Architect', team: 'create' },
    // ...more agents
  ],
  intel: [/* ... */],
  revenue: [/* ... */],
  exec: [/* ... */]
};

function getTeamColor(team) {
  const colors = {
    create: '#6E56CF',
    intel: '#59A5F1', 
    revenue: '#27A644',
    exec: '#F1B859'
  };
  return colors[team] || '#6E56CF';
}

function renderAgentCard(agent, team) {
  return `
    <div class="agent-card" data-agent="${agent.id}" data-team="${team}">
      <div class="agent-header">
        <div class="agent-avatar" style="background: ${getTeamColor(team)}20;">
          ${agent.emoji}
        </div>
        <div class="agent-meta">
          <div class="agent-name">${agent.name}</div>
          <div class="agent-role">${agent.role}</div>
        </div>
        <div class="agent-status ${agent.status}"></div>
      </div>
      <div class="agent-description">${agent.description}</div>
      <div class="agent-actions">
        <button class="agent-btn agent-btn-primary" onclick="invokeAgent('${agent.id}')">
          ▶ Invoke
        </button>
        <button class="agent-btn agent-btn-secondary" onclick="viewDetails('${agent.id}')">
          Details
        </button>
      </div>
    </div>
  `;
}
```

## Testing Checklist

Before considering complete:
- [ ] All sidebar navigation items work
- [ ] Each section displays correct content
- [ ] Modals open/close properly
- [ ] Forms validate and submit
- [ ] State persists across reloads
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard shortcuts functional
- [ ] No console errors
- [ ] Smooth animations/transitions
- [ ] File structure validated (tags properly closed)
- [ ] **Degradation detection panel shows 4 metrics with correct colors**
- [ ] **Agent invocation panel opens from header and per-agent buttons**
- [ ] **Agent teams render with correct team colors**
- [ ] **Activity log updates when agents are invoked**
