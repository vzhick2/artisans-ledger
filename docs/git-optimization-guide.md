# Git Optimization Guide for Rapid Prototyping

## Problem: Slow Git Operations
Git commands timing out or taking too long during rapid prototyping cycles. This guide provides expert-recommended optimizations for faster git operations.

## Quick Fixes (Immediate Impact)

### 1. Optimize Git Configuration
```bash
# Enable parallel processing (speeds up checkout/status)
git config core.preloadindex true
git config core.fscache true
git config gc.auto 256

# Optimize for Windows specifically
git config core.longpaths true
git config core.autocrlf false

# Speed up git status and operations
git config status.showUntrackedFiles normal
git config diff.algorithm histogram

# Enable file system monitoring (Git 2.37+)
git config core.fsmonitor true
git config core.untrackedcache true
```

### 2. Streamlined Commit Templates
Create shorter, standardized commit messages:

```bash
# feat: brief description
# fix: brief description  
# perf: brief description
# refactor: brief description
# docs: brief description
```

### 3. Efficient Git Aliases
```bash
# Quick status
git config alias.s "status -s"

# Quick add all and commit
git config alias.ac "!git add . && git commit -m"

# Quick add, commit, and push
git config alias.acp "!f() { git add . && git commit -m \"$1\" && git push; }; f"

# Abbreviated log
git config alias.l "log --oneline -10"

# Quick amend
git config alias.amend "commit --amend --no-edit"
```

## Rapid Prototyping Workflow

### Method 1: Bulk Commits (Recommended for Prototyping)
Instead of many small commits, group related changes:

```bash
# Work on multiple features, then commit once
git add .
git commit -m "feat: implement performance optimizations batch 1"

# For major milestones
git add .
git commit -m "milestone: complete Phase 1 performance optimization"
```

### Method 2: Automated Commit Messages
```bash
# Use conventional prefixes with minimal description
git add .
git commit -m "wip: $(date +%H:%M) - optimization work"

# Or feature-based
git add .
git commit -m "feat: item card memoization + search optimization"
```

### Method 3: Fast Squash Workflow
```bash
# Multiple quick commits during development
git add .
git commit -m "wip"

git add .  
git commit -m "wip"

# Then squash before push
git reset --soft HEAD~2
git commit -m "feat: complete performance optimization implementation"
```

## Expert Optimizations

### 1. Reduce File Scanning
```bash
# Add .gitignore patterns for common build artifacts
echo "*.log" >> .gitignore
echo ".next/" >> .gitignore
echo "node_modules/" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "*.tmp" >> .gitignore
```

### 2. Optimize Repository
```bash
# Clean up repository (run weekly)
git gc --aggressive
git prune

# Reduce pack file size
git repack -a -d --depth=50 --window=50
```

### 3. Partial Staging for Large Changes
```bash
# Stage specific types of files only
git add "*.tsx" "*.ts"
git commit -m "feat: component updates"

git add "*.md" "docs/"
git commit -m "docs: update documentation"
```

## PowerShell-Specific Optimizations

### Fast Commit Function
Add to PowerShell profile:
```powershell
function gac($message) {
    git add .
    git commit -m $message
}

function gacp($message) {
    git add .
    git commit -m $message
    git push
}

# Usage: gac "feat: quick update"
# Usage: gacp "feat: complete feature"
```

### Git Status Check
```powershell
function gs() {
    git status -s
}

function gl() {
    git log --oneline -5
}
```

## Recommended Commit Message Templates

### For Rapid Prototyping
```bash
# Template 1: Time-based
"wip: $(date +%H:%M) - feature work"

# Template 2: Feature-based  
"feat: item optimization"
"fix: search issues"
"perf: memoization"
"style: ui updates"

# Template 3: Batch commits
"batch: UI improvements + performance + docs"
"milestone: Phase 1 complete"
"snapshot: end of day progress"
```

### For Important Commits
```bash
"feat: implement component memoization with 60% render reduction
- Add React.memo to ItemCard component
- Optimize callback functions with useCallback
- Implement performance logging for development"

"perf: optimize bundle size and lazy loading
- Add dynamic imports for heavy components  
- Implement intersection observer for images
- Reduce initial bundle by 30%"
```

## Troubleshooting Slow Git

### 1. Check Repository Size
```bash
# Check if repository is too large
git count-objects -vH

# If over 500MB, consider:
git filter-branch --tree-filter 'rm -rf node_modules' HEAD
```

### 2. Network Issues
```bash
# Use SSH instead of HTTPS (faster authentication)
git remote set-url origin git@github.com:user/repo.git

# Or configure credential caching
git config credential.helper store
```

### 3. Windows-Specific Issues
```bash
# Disable Windows Defender scanning for git folder
# Add exclusion for: C:\Users\[user]\.git

# Use Git for Windows with proper settings
git config core.symlinks false
git config core.filemode false
```

## Automation Scripts

### Daily Git Cleanup (run weekly)
```bash
#!/bin/bash
# cleanup.sh
git gc --auto
git remote prune origin
git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
echo "Git repository optimized!"
```

### Quick Commit Script
```bash
#!/bin/bash
# quick-commit.sh
if [ -z "$1" ]; then
    echo "Usage: ./quick-commit.sh 'commit message'"
    exit 1
fi

git add .
git status -s
echo "Committing with message: $1"
git commit -m "$1"
echo "Commit complete!"
```

## Performance Monitoring

### Measure Git Performance
```bash
# Time git operations
time git status
time git add .
time git commit -m "test"

# Check git configuration
git config --list | grep -E "(core|status|diff)"
```

### Benchmark Different Approaches
```bash
# Method 1: Individual files
time git add file1.ts file2.ts && git commit -m "selective"

# Method 2: Bulk add
time git add . && git commit -m "bulk"

# Method 3: Cached
time git commit -am "cached"
```

## Best Practices for Rapid Prototyping

### 1. Commit Frequency
- **High-velocity development**: Commit every 15-30 minutes
- **Feature completion**: One commit per working feature
- **End of session**: Always commit before stopping work

### 2. Message Strategy
- **WIP commits**: Use simple "wip: description" format
- **Feature commits**: Use conventional commits "feat: description"
- **Squash later**: Clean up commit history before sharing

### 3. Branching Strategy
- **Main branch**: For stable, tested features only
- **Feature branches**: For experimental work (can be messy)
- **Quick prototypes**: Use temporary branches, delete after merging

## Implementation for This Project

### Immediate Actions
```bash
# Apply optimizations
git config core.preloadindex true
git config core.fscache true
git config core.untrackedcache true

# Add helpful aliases
git config alias.ac "!git add . && git commit -m"
git config alias.s "status -s"
git config alias.amend "commit --amend --no-edit"

# Quick usage:
# git ac "feat: quick update"
# git s  # for quick status
```

### PowerShell Function (Add to profile)
```powershell
function Quick-Commit($message) {
    Write-Host "Adding files..." -ForegroundColor Yellow
    git add .
    Write-Host "Committing: $message" -ForegroundColor Green
    git commit -m $message
    Write-Host "Done!" -ForegroundColor Green
}

# Usage: Quick-Commit "feat: performance improvements"
```

## Summary

**Fastest approach for prototyping:**
1. Use `git ac "message"` alias for add+commit
2. Batch related changes into single commits
3. Use simple message format: "feat: brief description"
4. Clean up commit history later with squash if needed
5. Apply git configuration optimizations once

**Expected improvement:** 60-80% faster git operations, especially on Windows with proper configuration.

---
*Pro tip: The key is balancing speed with useful history. For rapid prototyping, speed wins - you can always clean up the history later!*
