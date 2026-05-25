# Incident: Orchestrator Becoming Fixer

**Date:** 2026-05-16  
**Session:** Phase 5 Build Validation - Agent OS Dashboard  
**Severity:** Process Violation (Corrected)

---

## Incident Summary

During Phase 5 final build validation, Kiri (orchestrator) violated delegation hierarchy by directly patching TypeScript errors while waiting for dispatched agents to complete long-running tasks.

---

## Timeline

1. **Dispatched:** @keystone for build verification (~3+ minute task)
2. **Build failed:** TypeScript errors in SystemMetrics.tsx
3. **❌ VIOLATION:** Kiri patched files directly:
   - SystemMetrics.tsx - status prop type fix
   - error/index.ts - removed ErrorDisplay export
   - use-sanitized-input.tsx - useRef initialization
4. **User corrected:** 
   ```
   "Please don't fix anything yourself just have an agent do whatever you find"
   "remember you are an orchestrator not a fixer you oversee and dispatch"
   "you don't try and fix it yourself thanks!"
   ```
5. **✅ CORRECTED:** Returned to dispatch-only mode
   - Dispatched @forgemaster for fix
   - Dispatched @keystone for verification
   - Monitored without direct intervention

---

## Root Cause

**Temptation during wait:** Agent (@keystone) taking 3+ minutes for `npm run build`. TypeScript errors visible in output. Immediate fix seems faster than dispatching another agent.

**Psychological trap:** "I'll just patch this one thing while waiting" → becomes fixer, not orchestrator.

---

## Correct Pattern (Post-Learning)

```
[Build fails with TypeScript errors]
  ↓
❌ WRONG: "I'll patch this quickly"
  → patch file directly
  → lose orchestrator role

✅ CORRECT: "@forgemaster, please fix the TypeScript errors in [file]"
  → agent dispatched
  → proper attribution
  → user visibility
  → maintain orchestrator role
```

---

## Key Lesson

**Orchestrator Never Implements:**
- Even during agent delays
- Even for "simple" fixes
- Even under time pressure

**Correct Response to Delay:**
1. Report "waiting" status
2. Dispatch additional agent if needed
3. Maintain separation of concerns

---

## Related

- Skill: `kiri-coordination-guardrails` - section "Specific Trap: Incremental Fix During Agent Waits"
- Principle: Delegation hierarchy
- Agent Role: Orchestrator vs Implementer