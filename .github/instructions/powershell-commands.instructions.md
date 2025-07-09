---
applyTo: "**"
description: "PowerShell command reference for AI assistants"
---

# PowerShell Quick Reference for AI Development

## File Operations (MANDATORY)
- Check existence: `Test-Path "file.txt"`
- List files: `Get-ChildItem -Path "src" -Recurse`
- Remove safely: `Remove-Item -Path "file.txt" -Force -ErrorAction SilentlyContinue`
- Search in files: `Select-String -Path "**/*.ts" -Pattern "search-term"`

## Conditional Operations
```powershell
# Always check before operations
if (Test-Path "file.txt") { 
    Write-Host "File exists" 
} else { 
    Write-Host "File not found" 
}

# Loop through files safely
$files = @("file1.txt", "file2.txt")
foreach ($file in $files) {
    if (Test-Path $file) { Remove-Item $file -Force }
}
```

## CRITICAL RULES
- ❌ NEVER USE: `ls`, `grep`, `rm`, `mv`, `echo` (Linux commands)
- ✅ ALWAYS USE: PowerShell equivalents with proper error handling
- ⚠️ ALWAYS use `Test-Path` before file operations to prevent failures
