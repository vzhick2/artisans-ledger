# AI Workflow Guide - Speed-Optimized Development

## ⚡ FAST-TRACK DEVELOPMENT WORKFLOW

This guide eliminates bottlenecks and timeouts for rapid AI-assisted development.

## 🚀 SPEED OPTIMIZATIONS APPLIED

### Git Performance Boost
```bash
# Already configured for this project:
git config core.preloadindex true     # Parallel processing
git config core.fscache true          # Windows file system cache
git config core.untrackedcache true   # Cache untracked files

# Fast aliases now available:
git ac "message"    # Add all + commit
git s              # Quick status
git p              # Quick push
```

## ⚡ RAPID COMMIT STRATEGY

### Use These Fast Patterns:
```bash
# Feature work
git ac "feat: item optimization"

# Bug fixes  
git ac "fix: search issue"

# Performance
git ac "perf: memoization"

# Batch work (RECOMMENDED)
git ac "batch: UI + perf + docs"

# End of session
git ac "snapshot: $(date +%H:%M) progress"
```

### Skip Detailed Messages During Prototyping
❌ Slow: Writing detailed commit messages during development
✅ Fast: Use prefixes + brief description, clean up later

## 🔄 ITERATION WORKFLOW

### 1. Development Cycle (Repeat)
```bash
# Work on features...
git ac "wip: feature progress"
# Continue working...
git ac "wip: more updates"
# Feature complete
git ac "feat: complete feature X"
```

### 2. Clean Up Later (Optional)
```bash
# Squash work-in-progress commits
git reset --soft HEAD~3
git commit -m "feat: implement complete feature X with optimizations"
```

## 🎯 CURRENT PROJECT STATUS

### ✅ COMPLETED OPTIMIZATIONS
- **Error Handling**: Comprehensive error boundaries
- **Accessibility**: ARIA labels, focus management, screen reader support
- **Performance**: Component memoization, lazy loading infrastructure
- **Mobile**: FloatingActionButton, responsive design
- **Documentation**: Complete guides and best practices

### 🚧 CONTINUE ITERATION ON:
1. **Bundle Size**: Implement dynamic imports for heavy components
2. **Virtual Scrolling**: For large item lists (1000+ items)
3. **Image Optimization**: Lazy loading with progressive enhancement
4. **Service Workers**: Background sync and caching
5. **Database Integration**: Prepare for Supabase Phase 2

## 🛠️ FAST DEVELOPMENT COMMANDS

### Quick File Operations
```bash
# Check what's changed
git s

# Quick commit current work
git ac "wip: $(date +%H:%M)"

# Commit feature completion
git ac "feat: complete [feature-name]"

# Push when ready
git p
```

### Development Shortcuts
```bash
# Build check (fast)
npm run build

# Start dev (background if needed)
npm run dev

# Type check only
npx tsc --noEmit
```

## 🎮 AI COLLABORATION PATTERNS

### Effective Prompts for Speed
```
✅ "Continue with performance optimizations"
✅ "Implement virtual scrolling for items list"
✅ "Add lazy loading to dashboard components"
✅ "Optimize bundle size with dynamic imports"

❌ "Can you help me with..." (too vague)
❌ Long explanations (wastes time)
```

### Context Management
- Keep current file context visible
- Reference specific components/files
- Build incrementally on previous work
- Focus on one optimization area at a time

## 📊 PERFORMANCE TRACKING

### Quick Metrics Check
```bash
# Bundle size after build
npm run build | grep "kB"

# Git repository health
git count-objects -vH

# File change overview
git s
```

### Development Velocity Indicators
- Commits per hour: Target 4-8 for active development
- Build time: Should stay under 5 seconds
- Git operations: Should complete in 1-2 seconds

## 🔥 RAPID PROTOTYPING MODE

### When Speed > Perfection
1. **Use WIP commits frequently** - Don't overthink messages
2. **Batch related changes** - Combine UI + logic + docs
3. **Skip non-critical optimization** - Focus on working features first
4. **Clean up in dedicated sessions** - Separate development from cleanup

### Emergency Fast-Track
```bash
# Ultimate speed mode (use sparingly)
git add . && git commit -m "snapshot" && git push
```

## 🎯 NEXT PRIORITIES

### Phase 2A: Performance (High Impact)
- [ ] Dynamic imports for form components (30% bundle reduction)
- [ ] Virtual scrolling for items (handles 1000+ items)
- [ ] Image lazy loading with intersection observer
- [ ] Web Workers for heavy calculations

### Phase 2B: User Experience
- [ ] Service worker for offline support
- [ ] Progressive enhancement
- [ ] Advanced animations and transitions
- [ ] Keyboard navigation improvements

### Phase 2C: Production Ready
- [ ] Supabase integration
- [ ] Authentication flow
- [ ] Error reporting and analytics
- [ ] Deployment optimization

## 🚨 BOTTLENECK ELIMINATION

### Common Slowdowns & Solutions
| Problem | Solution |
|---------|----------|
| Git timeouts | Use aliases: `git ac "message"` |
| Long build times | Focus on specific components |
| Commit message anxiety | Use prefixes + clean up later |
| Context switching | Work in 25-min focused blocks |
| Over-optimization | Ship working features first |

## 📝 DEVELOPMENT LOG FORMAT

### Quick Session Notes
```
## [DATE] - [TIME]
**Focus:** Performance optimization
**Completed:** Component memoization, lazy loading setup
**Next:** Virtual scrolling implementation
**Issues:** None
**Commits:** 3 (feat: memoization, perf: lazy loading, docs: update)
```

## 🎪 RAPID ITERATION CHECKLIST

### Before Each Session (30 seconds)
- [ ] `git s` - Check current state
- [ ] Review last commit message
- [ ] Identify 1-2 specific goals

### During Development (Every 15-30 min)
- [ ] `git ac "progress description"`
- [ ] Quick build check if major changes
- [ ] Keep notes of what's working

### End of Session (1 minute)
- [ ] `git ac "session: [summary]"`
- [ ] `git p` if ready to share
- [ ] Update development log

---

## 🚀 READY TO CONTINUE?

**Current status:** All optimizations applied, git configured for speed, ready for next iteration.

**Recommended next action:** Pick one area (performance, UX, or production) and iterate rapidly with frequent commits using the fast workflow above.

**Remember:** Speed > Perfection during prototyping. We can always refactor and clean up later!
