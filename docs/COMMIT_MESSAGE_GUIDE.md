# Commit Message Guide for Automated Release Notes

This guide helps write commit messages that generate better automated release notes.

## Commit Message Format

The intelligent release notes generator analyzes commit messages to categorize and describe features. Use these patterns for best results:

### ✨ New Features
```
feat: Add user profile management
feat(savings): Implement goal deletion with balance transfer  
add: New expense tracking functionality
implement: Dark mode theme switching
```
**Result:** Appears in "✨ New Features" section

### 🔧 Bug Fixes  
```
fix: Resolve database connection timeout issue
fix(api): Correct savings goal calculation error
bugfix: Fix memory leak in transaction processing
```
**Result:** Appears in "🔧 Bug Fixes" section

### 🎨 UI/UX Improvements
```
ui: Update savings goal card design
ux: Improve navigation flow for child users
update: Enhance button styling and interactions  
improve: Better responsive layout for tablets
```
**Result:** Appears in "🎨 UI/UX Improvements" section

### 🐳 Infrastructure & Docker
```
docker: Fix port mapping consistency (3300:3300)
ci: Add automated testing pipeline
build: Optimize Docker image size
infrastructure: Update deployment scripts
```
**Result:** Appears in "🐳 Infrastructure" section

### ⚡ Performance
```
perf: Optimize database query performance
optimize: Reduce bundle size by 30%
improve: Speed up transaction processing
```
**Result:** Appears in "⚡ Performance" section

### 📚 Documentation
```
docs: Update API documentation
add: Contributing guidelines for developers
update: README with new installation steps
```
**Result:** Appears in "📚 Documentation" section

## Best Practices

### ✅ Good Examples
```bash
# Clear, action-oriented, user benefit obvious
feat: Add savings goal deletion with balance transfer options
fix: Resolve "Failed to load savings goals" database error  
ui: Enhance delete confirmation dialog with balance options
docker: Fix development port mapping for consistent access
```

### ❌ Avoid These
```bash
# Too technical, no user benefit clear
refactor: Extract savingsGoalService methods  
chore: Update dependencies
wip: Working on delete feature
misc: Various changes
```

## How It Becomes Release Notes

**Your Commit:**
```
feat(savings): Add goal deletion with balance transfer options
```

**Becomes:**
```
✨ New Features
- **Add goal deletion with balance transfer options**
```

**Your Commit:**
```  
fix: Resolve database connection timeout in savings page
```

**Becomes:**
```
🔧 Bug Fixes  
- **Fixed issue with database connection timeout in savings page**
```

## Tips for Better Release Notes

1. **Start with action verbs:** Add, Fix, Update, Improve, Implement
2. **Be user-focused:** What does this change do for users?
3. **Include context:** Which part of the app is affected?
4. **Avoid internal jargon:** Users don't care about "refactoring"
5. **Use conventional commits:** feat:, fix:, ui:, docs:, etc.

## Example Workflow

```bash
# Working on savings goal deletion feature
git commit -m "feat(savings): Add delete goal button to edit modal"
git commit -m "feat(savings): Implement balance transfer confirmation dialog"  
git commit -m "feat(api): Add DELETE endpoint with transfer_balance parameter"
git commit -m "ui: Enhance goal card with delete confirmation workflow"

# When you release, these become:
# ✨ New Features
# - **Add delete goal button to edit modal**
# - **Implement balance transfer confirmation dialog** 
# - **Add DELETE endpoint with transfer_balance parameter**
# 
# 🎨 UI/UX Improvements  
# - **Enhanced goal card with delete confirmation workflow**
```

## Testing Your Messages

Before pushing, test how your commits will look:

```bash
# Test release notes generation
python3 scripts/generate-release-notes.py 1.3.8 v1.3.7
```

This shows you exactly how your commit messages will appear in release notes!