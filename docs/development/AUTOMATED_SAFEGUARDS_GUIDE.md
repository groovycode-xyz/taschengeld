# Automated Safeguards System - Developer Guide

**Last Updated**: 2025-08-19  
**Version**: 1.0  
**Project**: Taschengeld (Family Allowance Tracker)

## Table of Contents

1. [Overview](#overview)
2. [Why This System Exists](#why-this-system-exists)
3. [Multi-Layer Protection Architecture](#multi-layer-protection-architecture)
4. [Local Protection (Claude Code Hooks)](#local-protection-claude-code-hooks)
5. [CI/CD Protection (GitHub Actions)](#cicd-protection-github-actions)
6. [Developer Workflow](#developer-workflow)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Configuration Reference](#configuration-reference)
9. [Testing the System](#testing-the-system)
10. [Maintenance and Updates](#maintenance-and-updates)

---

## Overview

The Taschengeld project uses a comprehensive automated safeguards system to prevent build failures, deployment issues, and maintain code quality. This system provides multiple layers of protection from local development through to production deployment.

**Key Benefits:**
- ✅ Prevents TypeScript errors from reaching production
- ✅ Ensures consistent code formatting across the team
- ✅ Blocks broken builds from being deployed
- ✅ Maintains GitHub/DockerHub version synchronization
- ✅ Reduces human error in following development processes

---

## Why This System Exists

### The Problem We Solved

In August 2025, during the savings goals feature implementation, we experienced cascading build failures that caused:

1. **Multiple failed Docker builds** due to uncaught TypeScript errors
2. **Prettier formatting issues** not caught before commits
3. **Skipped pre-merge validation** (human error in following ../../CLAUDE.md guidelines)  
4. **Version mismatch** between GitHub releases (v1.3.4) and DockerHub (should sync automatically)
5. **Production deployment delays** and hotfix requirements

### The Solution

A multi-layer automated protection system that:
- **Prevents issues locally** before they're committed
- **Validates changes** before they reach main branch
- **Ensures build success** before production deployment
- **Eliminates human error** through automation

---

## Multi-Layer Protection Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-LAYER PROTECTION                       │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: LOCAL (Claude Code Hooks)                             │
│ ├─ Auto-format after file edits                                │
│ ├─ Pre-commit validation (TypeScript + lint + format)          │
│ └─ Pre-push validation (build:test before push)                │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: CI/CD (GitHub Actions)                                │
│ ├─ PR Validation (format + TypeScript + lint + build)          │
│ ├─ Build Validation on development branch                      │
│ └─ Docker Build Validation on main branch                      │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: DEPLOYMENT PROTECTION                                 │
│ ├─ Multi-architecture Docker builds with testing               │
│ ├─ Database connectivity validation                            │
│ └─ API endpoint health checks                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Failure Points Eliminated:**
- **Before Commit**: TypeScript errors, formatting issues
- **Before Push**: Build failures
- **Before Merge**: All validation failures  
- **Before Deploy**: Docker build issues, runtime problems

---

## Local Protection (Claude Code Hooks)

### Hook System Overview

Claude Code hooks run automatically when you use development tools, providing immediate feedback and preventing issues from being committed.

### 1. Auto-Format Hook (`auto_format.py`)

**Triggers**: After Edit, MultiEdit, or Write operations on TypeScript/JavaScript files  
**Purpose**: Automatically formats code to prevent formatting inconsistencies

```python
# Runs automatically after file edits
# Formats: .ts, .tsx, .js, .jsx, .json files
# Uses: npx prettier --write [file]
```

**What You'll See:**
```
🎨 Auto-formatting src/components/Button.tsx...
✅ Formatted src/components/Button.tsx
```

### 2. Pre-Commit Hook (`pre_commit_check.py`)

**Triggers**: Before `git commit` commands  
**Purpose**: Validates code quality before committing changes

**Validation Steps:**
1. **TypeScript Check**: `npx tsc --noEmit`
2. **Code Formatting**: `npm run format` 
3. **Linting**: `npm run lint`

**What You'll See:**
```
🔍 Pre-commit validation...
Running TypeScript check...
Running Code formatting...
Running Linting...
✅ All pre-commit checks passed!
```

**If Issues Found:**
```
❌ TypeScript check failed!
[Error details]

📋 Please fix the issues before committing.
```

### 3. Pre-Push Hook (`validate_push.py`)

**Triggers**: Before `git push` to main/development branches  
**Purpose**: Ensures builds pass before pushing to protected branches

**Validation**: Runs `npm run build:test` (TypeScript + lint + format + build)

**What You'll See:**
```
🛡️  Protected branch push detected. Running build validation...
✅ Build validation passed!
```

**If Build Fails:**
```
❌ Build validation failed!
Error output: [Build errors]

📋 Please fix the issues and run 'npm run build:test' locally before pushing.
```

### Hook Configuration

Located in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 $CLAUDE_PROJECT_DIR/.claude/hooks/validate_push.py"
          },
          {
            "type": "command", 
            "command": "python3 $CLAUDE_PROJECT_DIR/.claude/hooks/pre_commit_check.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 $CLAUDE_PROJECT_DIR/.claude/hooks/auto_format.py"
          }
        ]
      }
    ]
  }
}
```

---

## CI/CD Protection (GitHub Actions)

### 1. PR Validation Workflow (`.github/workflows/pr-validation.yml`)

**Triggers**: Pull requests opened, synchronized, or reopened  
**Purpose**: Comprehensive validation before merge

**Steps:**
1. **Setup**: Node.js 18, npm dependencies
2. **Format Check**: `npm run format` + git diff validation
3. **TypeScript Check**: `npx tsc --noEmit`
4. **Linting**: `npm run lint`
5. **Build Test**: `npm run build`
6. **Prisma Generation**: `npx prisma generate`

**On Failure**: Automatically comments on PR with fix instructions

### 2. Build Validation Workflow (`.github/workflows/build-validation.yml`)

**Triggers**: Pushes to development branch, PRs to main/development  
**Purpose**: Validates production builds

**Steps:**
1. TypeScript compilation check
2. ESLint validation
3. Prettier formatting check
4. Production build test

### 3. Docker Build Workflow (`.github/workflows/docker-build.yml`)

**Triggers**: Pushes to main branch  
**Purpose**: Multi-architecture Docker builds with comprehensive testing

**Steps:**
1. **Validation**: Commit size, dependencies
2. **Build**: Multi-arch (AMD64/ARM64) Docker images
3. **Testing**: Image validation, database connectivity, API health checks
4. **Deployment**: Push to DockerHub with proper versioning

---

## Developer Workflow

### Daily Development Process

```bash
# 1. Work in development branch (no build triggers)
git checkout development

# 2. Make changes - auto-formatting happens automatically
# Edit files with Claude or your editor

# 3. Commit changes - pre-commit validation runs automatically  
git commit -m "Add new feature"
# 🔍 Pre-commit validation runs automatically

# 4. Push to development - no build validation (safe for experimentation)
git push origin development

# 5. When ready for production - switch to main
git checkout main
git merge development

# 6. Push to main - pre-push validation runs automatically
git push origin main
# 🛡️ Pre-push validation + Docker builds trigger
```

### Pull Request Process

```bash
# 1. Create feature branch from main
git checkout -b feature/new-feature

# 2. Develop feature with automatic safeguards
# All hooks run automatically during development

# 3. Push feature branch
git push origin feature/new-feature

# 4. Create pull request
# PR Validation workflow runs automatically

# 5. Fix any issues reported by automation
# Validation ensures quality before merge

# 6. Merge to main triggers full Docker build
```

### What Happens Automatically

| Action | Hook/Workflow | Validation |
|--------|---------------|------------|
| Edit file | Auto-format hook | Prettier formatting |
| `git commit` | Pre-commit hook | TypeScript + lint + format |
| `git push` to main/dev | Pre-push hook | `npm run build:test` |
| Create PR | PR Validation | Full build validation |
| Push to main | Docker Build | Multi-arch build + testing |

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Hooks Not Running

**Symptoms:**
- No hook messages when committing/pushing
- Formatting not happening automatically

**Diagnostics:**
```bash
# Check if settings.json exists and is valid
cat .claude/settings.json | python3 -m json.tool

# Check if hook scripts are executable
ls -la .claude/hooks/*.py

# Test Python 3 availability
python3 --version

# Test hook scripts manually
echo '{"tool_input":{"command":"git commit"}}' | python3 .claude/hooks/pre_commit_check.py
```

**Solutions:**
```bash
# Make hook scripts executable
chmod +x .claude/hooks/*.py

# Reinstall Claude Code if hooks still don't work
# Check Claude Code documentation for hook troubleshooting
```

#### 2. Pre-Commit Hook Failing

**Symptoms:**
```
❌ TypeScript check failed!
❌ Code formatting failed!
❌ Linting failed!
```

**Solutions:**
```bash
# Run checks manually to see detailed errors
npx tsc --noEmit                # TypeScript check
npm run format                  # Fix formatting
npm run lint                    # Fix linting issues

# Run complete check
npm run check

# If issues persist, check specific error messages
npm run build:test              # Full validation
```

#### 3. Pre-Push Hook Blocking

**Symptoms:**
```
❌ Build validation failed!
📋 Please fix the issues and run 'npm run build:test' locally before pushing.
```

**Solutions:**
```bash
# Run the exact same validation locally
npm run build:test

# Check specific build errors
npm run check                   # TypeScript + lint + format
npm run build                   # Next.js build

# Fix issues based on error output
# Common fixes:
npm run format                  # Fix formatting
# Fix TypeScript errors in IDE
# Update dependencies if needed
```

#### 4. CI/CD Workflows Failing

**Symptoms:**
- PR validation workflow fails
- Docker build workflow fails
- Red status checks on PRs

**Diagnostics:**
```bash
# Check GitHub Actions logs
gh run list --branch main

# View specific workflow run
gh run view [run-id]

# Check local validation matches CI
npm run build:test              # Should match PR validation
./scripts/build-multiarch.sh --local  # Should match Docker build
```

**Solutions:**

**For PR Validation Failures:**
```bash
# Run exact same steps as CI locally
npm ci
npm run format && git diff --exit-code
npx tsc --noEmit
npm run lint  
npm run build
npx prisma generate
```

**For Docker Build Failures:**
```bash
# Test Docker build locally
docker build -f Dockerfile.prod -t test-build .

# Test multi-arch build
./scripts/build-multiarch.sh --local

# Check for large commits (>10k lines)
git show --stat HEAD

# Verify all files are properly committed
git status
```

#### 5. Version Synchronization Issues

**Symptoms:**
- GitHub releases ahead of DockerHub
- Images not available on DockerHub
- Version mismatches

**Diagnostics:**
```bash
# Check current version
cat version.txt

# Check DockerHub images
docker manifest inspect groovycodexyz/taschengeld:latest

# Check GitHub releases
gh release list

# Check recent builds
gh run list --workflow=docker-build.yml
```

**Solutions:**
```bash
# Manual release trigger
gh workflow run release.yml --ref main

# Manual Docker build
./scripts/build-multiarch.sh --push --increment patch

# Check build logs for failures
gh run view [run-id] --log
```

### Environment Requirements

**Required Tools:**
- Python 3.x (for hook scripts)
- Node.js 18+ (for build commands)  
- npm (for package management)
- Git (for repository operations)
- Docker (for local testing)

**Verification Commands:**
```bash
python3 --version          # Should show Python 3.x
node --version             # Should show Node 18+
npm --version              # Should show npm version
git --version              # Should show Git version
docker --version           # Should show Docker version
```

### Debug Mode

**Enable Verbose Hook Output:**
```bash
# Add debug flag to hook commands in .claude/settings.json
# Modify command to include debug flag:
"command": "python3 $CLAUDE_PROJECT_DIR/.claude/hooks/validate_push.py --debug"
```

**Manual Hook Testing:**
```bash
# Test individual hooks
cd /path/to/project

# Test push validation
echo '{"tool_input":{"command":"git push origin main"}}' | \
python3 .claude/hooks/validate_push.py

# Test commit validation  
echo '{"tool_input":{"command":"git commit -m test"}}' | \
python3 .claude/hooks/pre_commit_check.py

# Test auto-formatting
echo '{"tool_input":{"file_path":"test.ts"}}' | \
python3 .claude/hooks/auto_format.py
```

---

## Configuration Reference

### Directory Structure

```
.claude/
├── hooks/
│   ├── validate_push.py      # Pre-push build validation
│   ├── auto_format.py        # Post-edit auto-formatting  
│   ├── pre_commit_check.py   # Pre-commit validation
│   └── README.md            # Hook documentation
├── pr-review-prompt.md      # PR review template
└── settings.json           # Hook configuration

.github/workflows/
├── pr-validation.yml        # PR build validation
├── build-validation.yml     # Development branch validation
└── docker-build.yml        # Production Docker builds
```

### Key Scripts in package.json

```json
{
  "scripts": {
    "build:test": "npm run check && npm run build",
    "check": "tsc --noEmit && npm run lint:dir && npm run format",
    "format": "prettier --write .",
    "lint": "prettier --write . && next lint"
  }
}
```

### Environment Variables

**For Local Development:**
- `CLAUDE_PROJECT_DIR`: Set automatically by Claude Code
- `SKIP_ENV_VALIDATION`: Set to "true" for build testing without DB

**For GitHub Actions:**
- `DOCKERHUB_USERNAME`: DockerHub account username
- `DOCKERHUB_TOKEN`: DockerHub access token

### Branch Strategy

**Protected Branches:**
- `main`: Production releases, triggers Docker builds
- `development`: Daily development, safe for experimentation

**Hook Behavior:**
- Pre-push validation only on `main`/`development` branches
- Pre-commit validation on all branches
- Auto-formatting on all file edits

---

## Testing the System

### Manual Testing

**Test Hook Scripts:**
```bash
# 1. Test auto-format hook
echo '{"tool_input":{"file_path":"test.json"}}' > test_format.json
echo '{"test":"value"}' > test.json
python3 .claude/hooks/auto_format.py < test_format.json
# Should show: "🎨 Auto-formatting test.json..." "✅ Formatted test.json"

# 2. Test pre-commit hook  
echo '{"tool_input":{"command":"git commit -m test"}}' | \
python3 .claude/hooks/pre_commit_check.py
# Should run TypeScript, formatting, and linting checks

# 3. Test pre-push hook
echo '{"tool_input":{"command":"git push origin main"}}' | \
python3 .claude/hooks/validate_push.py  
# Should run npm run build:test
```

**Test Build Commands:**
```bash
# Test the commands hooks rely on
npm run build:test             # Full validation (used by pre-push)
npm run check                  # TypeScript + lint + format (used by pre-commit)  
npm run format                 # Prettier formatting (used by auto-format)
```

**Test CI/CD Locally:**
```bash
# Test PR validation steps
npm ci
npm run format && git diff --exit-code
npx tsc --noEmit
npm run lint
npm run build
npx prisma generate

# Test Docker build
./scripts/build-multiarch.sh --local
```

### Integration Testing

**Create Test Scenarios:**

**1. Test TypeScript Error Prevention:**
```typescript
// Add intentional TypeScript error to a file
const x: string = 123; // Type error

// Try to commit - should be blocked by pre-commit hook
git add .
git commit -m "test commit"
// Expected: ❌ TypeScript check failed!
```

**2. Test Formatting Auto-Fix:**
```javascript
// Create poorly formatted file
const   x={a:1,b:2};let y=   3;

// Edit with Claude - should auto-format
// Expected: File automatically formatted by auto_format hook
```

**3. Test Build Failure Prevention:**
```bash
# Break the build (e.g., syntax error)
# Try to push to main
git push origin main
# Expected: ❌ Build validation failed!
```

**4. Test PR Protection:**
```bash
# Create PR with issues
git checkout -b test-branch
# Add code with TypeScript errors
git push origin test-branch
# Create PR - should fail PR validation
```

### Success Criteria

The system is working correctly when:

✅ **Local Protection:**
- Files are auto-formatted after edits
- Commits are blocked when TypeScript/lint errors exist
- Pushes to main/development are blocked when builds fail

✅ **CI/CD Protection:**  
- PRs fail validation when code quality issues exist
- Docker builds succeed consistently
- Images are pushed to DockerHub with correct versions

✅ **Developer Experience:**
- Clear error messages with actionable fixes
- Hooks don't interfere with normal development
- Fast feedback loops for issue resolution

---

## Maintenance and Updates

### Regular Maintenance

**Monthly Checks:**
```bash
# 1. Verify hook scripts are working
python3 .claude/hooks/validate_push.py --test
python3 .claude/hooks/auto_format.py --test  
python3 .claude/hooks/pre_commit_check.py --test

# 2. Update dependencies
npm audit fix

# 3. Check CI/CD workflow success rates
gh run list --workflow=docker-build.yml --limit=10

# 4. Verify DockerHub image availability
docker manifest inspect groovycodexyz/taschengeld:latest
```

**Quarterly Reviews:**
- Review hook effectiveness metrics
- Update troubleshooting documentation  
- Check for new Claude Code hook features
- Evaluate if additional safeguards are needed

### Updating the System

**When Adding New Validation Rules:**
```bash
# 1. Update hook scripts in .claude/hooks/
# 2. Test changes manually
# 3. Update this documentation
# 4. Test with sample scenarios
```

**When Modifying Workflows:**
```bash
# 1. Edit .github/workflows/*.yml files
# 2. Test with draft PRs
# 3. Monitor first few runs
# 4. Update documentation if needed
```

### Monitoring Success

**Key Metrics to Track:**
- **Build Failure Rate**: Should approach 0% on main branch
- **TypeScript Errors in Production**: Should be 0
- **Formatting Issues**: Should be automatically resolved
- **Version Synchronization**: GitHub and DockerHub should stay aligned

**Success Indicators:**
- No failed Docker builds on main branch
- No formatting-related commits
- No hotfixes required for TypeScript errors
- Consistent deployment cadence

---

## Conclusion

The Automated Safeguards System provides comprehensive protection against the build failures and deployment issues that previously affected the Taschengeld project. By implementing multiple layers of validation from local development through production deployment, we ensure:

- **Quality**: Code quality is maintained automatically
- **Reliability**: Builds consistently succeed  
- **Efficiency**: Issues are caught early in the development cycle
- **Confidence**: Developers can push changes knowing they'll work in production

This system eliminates human error from the development process while maintaining developer productivity and ensuring reliable deployments.

---

**For Support:**
- Check this guide's troubleshooting section
- Review GitHub Actions logs for CI/CD issues  
- Test hooks manually using the provided commands
- Refer to ../../CLAUDE.md for project-specific guidelines

**Last Updated**: 2025-08-19 by Claude Code Automated Safeguards Implementation