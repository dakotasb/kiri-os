# Release Notes Template

## Agent Framework Release Conventions

### Tagging Scheme

We use **vF.x.y** (Fleet version) semantics:

- **vF = Fleet version** — major architectural generation
- **x = feature milestone** — significant feature group
- **y = patch level** — fixes, tweaks, polish

#### Alternative: Semantic Versioning (if adopted later)
- MAJOR: Breaking changes to agent protocol or APIs
- MINOR: New agent features, backward compatible
- PATCH: Bug fixes, documentation updates

---

## Latest: vF.3.0 (Current Baseline)

**Released:** *(2026-05-03)*
**Tag:** `vF.3.0`
**Branch:** `master`

### Highlights
- Sidebar + Header layout established
- Ask Kiri integration
- Clean flexbox architecture

### Known Issues
- [ ] Fleet health module pending
- [ ] Agent registry initialization in progress

---

## Release Checklist

### Before Tagging
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md entries added
- [ ] Version strings bumped in key files

### At Release
- [ ] Git tag created: `git tag -a vF.x.y -m "Release vF.x.y"`
- [ ] Tag pushed: `git push origin vF.x.y`
- [ ] GitHub release draft created

### Post-Release
- [ ] Deployment smoke tests
- [ ] Agent health checks verify
- [ ] Team notified

---

## History

| Version | Date | Branch | Notes |
|---------|------|--------|-------|
| vF.3.0 | 2026-05-03 | master | Initial baseline |

---

*Maintained by Chronicle (Version Keeper Agent)*
