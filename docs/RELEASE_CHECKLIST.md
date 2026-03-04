# Release Checklist - Order Link

**Version:** v___  
**Release Date:** ___  
**Release Manager:** @pqorderbot

---

## Pre-Release

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] No TypeScript errors
- [ ] Code review completed
- [ ] CHANGELOG updated

### Version Bump
- [ ] Update version in `package.json`
- [ ] Update version in `electron/package.json`
- [ ] Git tag created (`git tag v1.0.0`)
- [ ] Tag pushed to remote (`git push origin v1.0.0`)

### Documentation
- [ ] README updated with new features
- [ ] Installation instructions verified
- [ ] User guide updated (if needed)
- [ ] API documentation updated (if needed)

---

## Build

### Local Build Test
- [ ] `npm run build:all` succeeds
- [ ] `npm run dist` succeeds
- [ ] No build warnings

### Platform-Specific Builds

#### Windows
- [ ] `.exe` installer builds successfully
- [ ] Installer runs without errors
- [ ] Application launches correctly
- [ ] Auto-update check works (if enabled)

#### macOS
- [ ] `.dmg` builds successfully
- [ ] Application launches without security warnings
- [ ] Code signing verified (if enabled)
- [ ] Notarization passes (if enabled)

#### Linux
- [ ] `.AppImage` builds successfully
- [ ] `.deb` package builds successfully
- [ ] Application launches correctly
- [ ] Desktop integration works

---

## Testing

### Installation Testing
- [ ] Fresh install on Windows 10/11
- [ ] Fresh install on macOS (latest)
- [ ] Fresh install on Ubuntu/Debian
- [ ] Upgrade from previous version (if applicable)

### Functional Testing
- [ ] Login flow works
- [ ] Order sync works
- [ ] Order conversion works
- [ ] Order submission works
- [ ] Settings persist correctly
- [ ] Data backup/restore works (if applicable)

### Performance Testing
- [ ] App launches in < 5 seconds
- [ ] Order sync completes in reasonable time
- [ ] Memory usage is acceptable (< 500MB)
- [ ] No memory leaks after extended use

---

## Release

### GitHub Release
- [ ] Release created on GitHub
- [ ] Release notes added
- [ ] All artifacts uploaded:
  - [ ] Windows installer (`.exe`)
  - [ ] macOS DMG (`.dmg`)
  - [ ] Linux AppImage (`.AppImage`)
  - [ ] Linux DEB (`.deb`)
- [ ] Release marked as latest (if applicable)
- [ ] Release is public/internal as intended

### Communication
- [ ] Team notified of release
- [ ] Release notes shared with stakeholders
- [ ] Support team briefed on new features
- [ ] Known issues documented

---

## Post-Release

### Monitoring
- [ ] GitHub download stats monitored
- [ ] Error reports monitored (if telemetry enabled)
- [ ] User feedback collected
- [ ] Auto-update adoption tracked (if enabled)

### Follow-up
- [ ] Critical issues addressed
- [ ] Bug fixes planned for next release
- [ ] Release retrospective scheduled

---

## Rollback Plan (if needed)

If critical issues are discovered:

1. **Stop distribution**: Mark release as pre-release
2. **Notify users**: Post announcement about known issues
3. **Fix and re-release**: Create hotfix release (v1.0.1)
4. **Document**: Add issue to known issues list

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| DevOps | @pqorderbot | | |
| QA | @Assistant_Quality_v26_Bot | | |
| PM | @MacAssistant_roadmap_V26_Bot | | |

---

**Template Version:** 1.0  
**Last Updated:** 2026-03-04
