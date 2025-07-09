---
applyTo: "**"
description: "AI development efficiency guidelines"
---

# AI Development Efficiency Guidelines

## Context Reading Best Practices
- Read large meaningful chunks (50-100 lines) instead of small sections
- Use parallel tool calls when reading multiple related files
- Combine related operations in single requests

## Tool Call Optimization
- Always use Test-Path before file operations
- Batch related file operations together
- Prefer specific prompts over vague requests like "continue"

## Prompt Engineering
- Be specific: "Add error handling to purchase form validation"
- Avoid ambiguity: Don't say "fix this" without context
- Break complex tasks into smaller, specific steps

## Emergency Fixes Only
- Only implement without asking for build fixes or broken functionality
- Always explain why emergency override was used
- Revert to asking permission after emergency is resolved
