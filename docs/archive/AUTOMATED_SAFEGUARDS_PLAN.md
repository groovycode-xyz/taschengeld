# Automated Safeguards Implementation Plan

**Created**: 2025-08-19 08:22  
**Context**: After savings goals deployment issues (TypeScript errors, Prettier formatting, skipped build validation)

## Problem We're Solving

1. **TypeScript errors** - Not caught before push
2. **Prettier formatting errors** - Not caught before push  
3. **Skipped pre-merge checklist** - Human error in following CLAUDE.md guidelines
4. **Build failures cascading** - Multiple failed builds, version mismatch GitHub vs DockerHub

## Multi-Layer Protection Strategy

### 1. Claude Code Hooks (Local Protection)

#### A. Pre-Push Build Validation Hook
**Location**: `.claude/hooks/validate_push.py`
**Purpose**: Run before git push to ensure builds pass

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
          }
        ]
      }
    ]
  }
}
```

**Script logic**:
- Detect if command is `git push`
- If pushing to main/development branches, run `npm run build:test`
- Block push if build fails
- Provide clear feedback about fixes needed

#### B. Post-Edit Formatting Hook
**Location**: `.claude/hooks/auto_format.py`
**Purpose**: Auto-format files after Claude edits them

```json
{
  "hooks": {
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

**Script logic**:
- Run Prettier on TypeScript/JavaScript files
- Fix formatting immediately after edits
- Prevent formatting errors from being committed

#### C. Pre-Commit Validation Hook
**Location**: `.claude/hooks/pre_commit_check.py`
**Purpose**: Enforce CLAUDE.md checklist before commits

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 $CLAUDE_PROJECT_DIR/.claude/hooks/pre_commit_check.py"
          }
        ]
      }
    ]
  }
}
```

**Script logic**:
- Check for `git commit` commands
- Run `npm run check` (TypeScript + lint + format)
- Block commits with errors
- Suggest running `npm run format` if needed

### 2. GitHub Actions Workflows (CI/CD Protection)

#### A. Enhanced PR Validation Workflow
**File**: `.github/workflows/pr-validation.yml`

```yaml
name: PR Validation

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run format check
        run: |
          npm run format
          git diff --exit-code || (echo "::error::Formatting issues found. Run 'npm run format' locally" && exit 1)
      
      - name: Run TypeScript check
        run: npx tsc --noEmit
        
      - name: Run linting
        run: npm run lint
        
      - name: Run build test
        run: npm run build
        
      - name: Generate Prisma Client
        run: npx prisma generate
        
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Build validation failed! Please run `npm run build:test` locally and fix any issues before merging.'
            })
```

#### B. Claude Code Review Bot
**File**: `.github/workflows/claude-review.yml`

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Claude Review
        uses: anthropics/claude-code-action@v1
        with:
          prompt_file: .claude/pr-review-prompt.md
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

**Review prompt** (`.claude/pr-review-prompt.md`):
```markdown
Review this PR for:
1. TypeScript type safety issues
2. Prettier formatting problems  
3. Compliance with CLAUDE.md guidelines
4. Missing build validation steps

If issues found, comment with specific fixes needed.
```

#### C. Auto-Fix Bot
**File**: `.github/workflows/claude-auto-fix.yml`

```yaml
name: Claude Auto-Fix

on:
  issue_comment:
    types: [created]

jobs:
  auto-fix:
    if: contains(github.event.comment.body, '@claude fix build')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Let Claude Fix Issues
        uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            The build is failing. Please:
            1. Run npm run format to fix formatting
            2. Fix any TypeScript errors
            3. Ensure npm run build:test passes
            4. Commit the fixes
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Hook Script Implementations

#### validate_push.py
```python
#!/usr/bin/env python3
import json
import sys
import subprocess
import os

def main():
    try:
        # Read tool input from stdin
        data = json.load(sys.stdin)
        command = data.get('tool_input', {}).get('command', '')
        
        # Check if this is a git push command
        if not command.startswith('git push'):
            sys.exit(0)  # Not a push, allow
            
        # Check if pushing to protected branches
        if any(branch in command for branch in ['origin main', 'origin development']):
            print("🛡️  Protected branch push detected. Running build validation...")
            
            # Run build test
            result = subprocess.run(['npm', 'run', 'build:test'], capture_output=True, text=True)
            
            if result.returncode != 0:
                print("❌ Build validation failed!")
                print("Error output:")
                print(result.stderr)
                print("\n📋 Please fix the issues and run 'npm run build:test' locally before pushing.")
                sys.exit(2)  # Block the push
            
            print("✅ Build validation passed!")
            
    except Exception as e:
        print(f"Warning: Hook validation failed: {e}")
        # Don't block on hook errors
        pass

if __name__ == "__main__":
    main()
```

#### auto_format.py
```python
#!/usr/bin/env python3
import json
import sys
import subprocess
import os

def main():
    try:
        # Read tool input from stdin  
        data = json.load(sys.stdin)
        file_path = data.get('tool_input', {}).get('file_path', '')
        
        # Check if file needs formatting
        if file_path.endswith(('.ts', '.tsx', '.js', '.jsx', '.json')):
            print(f"🎨 Auto-formatting {file_path}...")
            
            # Run prettier on the file
            result = subprocess.run(['npx', 'prettier', '--write', file_path], 
                                 capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Formatted {file_path}")
            else:
                print(f"⚠️  Warning: Could not format {file_path}: {result.stderr}")
                
    except Exception as e:
        print(f"Warning: Auto-format hook failed: {e}")
        # Don't block on formatting errors
        pass

if __name__ == "__main__":
    main()
```

#### pre_commit_check.py
```python
#!/usr/bin/env python3
import json
import sys
import subprocess

def main():
    try:
        # Read tool input from stdin
        data = json.load(sys.stdin)
        command = data.get('tool_input', {}).get('command', '')
        
        # Check if this is a git commit command
        if not command.startswith('git commit'):
            sys.exit(0)  # Not a commit, allow
            
        print("🔍 Pre-commit validation...")
        
        # Run checks
        checks = [
            (['npx', 'tsc', '--noEmit'], "TypeScript check"),
            (['npm', 'run', 'format'], "Code formatting"),
            (['npm', 'run', 'lint'], "Linting")
        ]
        
        for cmd, description in checks:
            print(f"Running {description}...")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                print(f"❌ {description} failed!")
                print(result.stderr)
                print("\n📋 Please fix the issues before committing.")
                sys.exit(2)  # Block the commit
                
        print("✅ All pre-commit checks passed!")
        
    except Exception as e:
        print(f"Warning: Pre-commit hook failed: {e}")
        # Don't block on hook errors
        pass

if __name__ == "__main__":
    main()
```

### 4. Directory Structure

```
.claude/
├── hooks/
│   ├── validate_push.py      # Pre-push build validation
│   ├── auto_format.py        # Post-edit formatting  
│   ├── pre_commit_check.py   # Pre-commit validation
│   └── README.md            # Hook documentation
├── pr-review-prompt.md      # Claude PR review template
└── settings.json           # Hook configuration

.github/
└── workflows/
    ├── pr-validation.yml    # PR build validation
    ├── claude-review.yml    # Automated code review
    └── claude-auto-fix.yml  # Auto-fix on command
```

### 5. GitHub Repository Settings

**Branch Protection Rules for `main`**:
- ✅ Require status checks to pass before merging
  - PR Validation workflow
  - Claude Code Review workflow
- ✅ Require branches to be up to date before merging
- ✅ Require pull request reviews before merging
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Restrict pushes that create files: No direct pushes to main

### 6. Benefits Summary

✅ **Multi-layer protection**: Local → Commit → Push → PR → Merge  
✅ **Automatic fixing**: Formatting fixed automatically, Claude can auto-fix via comments  
✅ **Clear feedback**: Immediate local feedback, CI/CD feedback, code review feedback  
✅ **Reduces human error**: Can't forget build:test, can't push broken code, can't merge broken PRs  
✅ **Prevents version mismatches**: Docker builds will consistently succeed

### 7. Implementation Order

1. **Create hook scripts** in `.claude/hooks/`
2. **Configure Claude Code hooks** in `.claude/settings.json`
3. **Add GitHub workflows** in `.github/workflows/`
4. **Configure branch protection** in GitHub settings
5. **Test with a sample PR** to verify all safeguards work
6. **Update CLAUDE.md** with new automated processes

### 8. What This Would Have Prevented

**Our Recent Issues**:
- ❌ TypeScript errors → ✅ Pre-commit hook would catch
- ❌ Prettier formatting → ✅ Auto-format hook would fix  
- ❌ Skipped build:test → ✅ Pre-push hook would enforce
- ❌ Failed Docker builds → ✅ PR validation would catch
- ❌ Version mismatch → ✅ Working builds = aligned versions

**Success Metrics**:
- Zero failed builds reaching main branch
- Zero formatting issues in commits  
- Zero TypeScript errors in production
- 100% adherence to CLAUDE.md checklist
- Aligned GitHub/DockerHub versions

---

**Next Steps**: Implement this system to eliminate human error and ensure consistent, reliable deployments.