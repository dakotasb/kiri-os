# WSL2 + Next.js localhost Networking Fix

**Session:** 2026-05-17  
**Problem:** Next.js dashboard on port 3001 accessible via curl from WSL but Firefox on Windows hangs indefinitely.

## Symptoms

| Test | Result |
|------|--------|
| `curl http://localhost:3001` from WSL | ✅ Returns HTML (166KB) immediately |
| Firefox to `http://localhost:3001` | ❌ Hangs on "Waiting for localhost..." |
| Firefox to `http://127.0.0.1:3001` | ❌ Still hangs |
| Server process running | ✅ Yes (PID visible) |
| Port listening | ✅ `ss -tlnp` shows port 3001 |

## Root Cause

**WSL2 Virtual IP Binding Problem:**

```bash
# WRONG - Server bound to WSL virtual IP
172.26.210.95:3001  # ← This IP does NOT forward to Windows localhost

# CORRECT - Server bound to all interfaces
*:3001               # ← WSL2 localhost forwarding works
127.0.0.1:3001       # ← Direct localhost loopback
```

**How the wrong binding happens:**
1. Server started from wrong directory (`~/snapshots/` instead of restore target)
2. Or: Server started with explicit `-H 172.26.210.95` flag
3. Or: Zombie process from previous attempt still holding port with wrong binding

## Fix Procedure

### Step 1: Kill All Next.js Processes

```bash
# Nuclear option - kill everything
pkill -9 -f "next-server"
pkill -9 -f "next dev"
sleep 2

# Verify port is free
ss -tlnp | grep 3001 || echo "Port 3001 is free"
```

### Step 2: Clear Build Cache

```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard
rm -rf .next node_modules/.cache
```

### Step 3: Start Server from Correct Directory

```bash
# Critical: Must be in target directory, NOT snapshot source
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard

# Start without explicit -H flag (lets Next.js bind to all interfaces)
npx next dev -p 3001

# Alternative if needed:
# npx next dev -p 3001 -H 0.0.0.0
```

### Step 4: Verify Correct Binding

```bash
ss -tlnp | grep 3001
# Expected output:
# LISTEN 0 511 *:3001 *:* users:(("next-server",pid=XXXX,fd=YY))
#                               ^
#                               Must be *:3001, NOT 172.x.x.x:3001
```

### Step 5: Test Both curl and Browser

```bash
# Test from WSL
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
# Expected: 200

# Then test from Windows browser
# http://localhost:3001
```

## WSL2 Requirements

In `~/.wslconfig` (Windows side):

```ini
[wsl2]
localhostForwarding=true  # Default, but verify
```

Restart WSL if changed:
```powershell
wsl --shutdown
# Then reopen WSL
```

## Common Mistakes

| Mistake | Why It Fails |
|---------|--------------|
| Starting from `~/snapshots/` | Server runs from archive, not target |
| Using `-H 172.26.210.95` | WSL virtual IP doesn't forward to Windows |
| Zombie process blocking port | New server can't bind to 3001 |
| Not clearing `.next` cache | Stale compiled output causes hangs |
| Starting before killing old process | Port conflict, server binds elsewhere |

## Browser Troubleshooting (After Server Fixed)

If server is correctly on `*:3001` but browser still hangs:

1. **Hard refresh:** Ctrl+Shift+R
2. **Disable extensions:** VPN/adblockers may block localhost
3. **Try different URL:**
   - `http://localhost:3001`
   - `http://127.0.0.1:3001`
   - `http://[::1]:3001` (IPv6)
4. **Test other browser:** Chrome/Edge to isolate Firefox issue
5. **Check proxy settings:** Firefox → Settings → Network → No proxy

## Prevention

After successful restore:

```bash
# Always verify process location
ps aux | grep next-server | grep -v grep
# Should show: ~/command_center/... NOT ~/snapshots/...

# Verify port binding weekly
ss -tlnp | grep 3001
```

## Session-Specific Notes

- Snapshot: `~/snapshots/dashboard-pre-color-update/`
- Restore target: `~/command_center/kirimvp_orchestration/phase3_build/dashboard/`
- Port: 3001 (user requirement)
- WSL IP discovered: `172.26.210.95` (changes on reboot)
- Server started with: `npx next dev -p 3001` (correct binding)
- Verification: `curl http://localhost:3001` returns 200 OK immediately
