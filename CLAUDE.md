# CLAUDE.md

This file provides essential guidance to Claude Code when working with the Taschengeld project.

## Project Overview

**Taschengeld** ("pocket money" in German) - Family allowance tracker with PIN-protected parent mode and simplified child mode for desktop/tablet devices (768px+ viewport).

**Key Identifiers:**
- **GitHub**: `groovycode-xyz/taschengeld` 
- **GitHub User**: `groovycode-xyz` not `barneephife` (use 'gh auth' cli to check and switch when necessary)
- **DockerHub**: `groovycodexyz/taschengeld`
- **Version**: Single source in `version.txt`
- **Domain**: `groovycode.xyz` (not .com)

## Architecture Essentials

**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind, PostgreSQL 16, Prisma ORM, Docker multi-arch

**Key Patterns:**
- **Service Pattern**: All database ops through `/app/lib/services/`
- **API Routes**: All mutations through `/app/api/` endpoints  
- **Context Providers**: Global state via React Context (`/components/context/`)
- **Component Structure**: Feature-based with shared UI in `/components/ui/`

## Automated Safeguards System

🛡️ **Multi-layer protection active** - prevents build failures and deployment issues:
- **Local**: Auto-format after edits, pre-commit/pre-push validation
- **CI/CD**: PR validation, build testing, Docker multi-arch builds
- **Configuration**: `.claude/settings.json` + `.claude/hooks/` scripts

**Pre-merge requirement**: Always run `npm run build:test` before merging to main

📚 **Complete details**: See `docs/development/AUTOMATED_SAFEGUARDS_GUIDE.md`

## Worktree-First Development

**CRITICAL**: Always use worktrees for new features, never regular git branches.

**When user requests new feature/branch work:**
```bash
# ✅ Correct approach
./scripts/worktree-manager.sh [feature-name]  # or: wt [feature-name]

# ❌ Never do this  
git checkout -b [branch-name]
```

**Process**: Create worktree → VS Code opens → User starts new Claude session in new window → Continue development

**Why**: Multi-tasking, no conflicts, isolated environments, VS Code integration

## Branch Strategy & Workflow

**Branch Types:**
- **`main`**: Production-ready, triggers CI/CD builds to DockerHub
- **`development`**: Daily development, safe for experimentation  
- **`feature/[name]`**: Major features (via worktrees)
- **`hotfix/[name]`**: Critical production fixes

**Daily Development:**
```bash
git checkout development     # Work here for daily development
# Make changes, test with npm run dev:docker
git push origin development  # Backs up to GitHub, no builds

# For production release:
git checkout main
git merge development  
./scripts/version-sync.sh --increment patch --release
```

## Essential Commands

### Development
```bash
npm run dev                   # Next.js dev server (port 3000)
npm run dev:docker            # Full stack in Docker (port 3300)  
npm run dev:docker:restart    # Restart keeping database data
npm run dev:docker:clean      # ⚠️ DANGER: Deletes ALL database data
```

### Code Quality (Required Before Merge)
```bash
npm run build:test           # ✅ REQUIRED: Test production build locally
npm run check               # TypeScript + lint + format
npm run format              # Prettier formatting
npm run lint               # ESLint + Prettier
```

### Build & Deployment
```bash
npm run build                        # Next.js build
./scripts/build-multiarch.sh --local # Test Docker build locally
./scripts/build-multiarch.sh --push  # Build + push to DockerHub
```

### Version Management
```bash
./scripts/version-sync.sh --increment patch --release  # Version bump + release
```

### Branch Documentation
```bash
npm run branches            # Show branch status
wt [feature-name]          # Create new worktree
wt --list                  # List all worktrees
wt --clean                 # Clean up merged branches
```

## Critical Constraints

1. **Always verify state first** - Check branch, uncommitted changes, recent activity
2. **Docker-first development** - Test in Docker, mirror production  
3. **Multi-architecture support** - Ensure builds work ARM64 + AMD64
4. **Document branches immediately** - Update BRANCHES.md + git descriptions
5. **Never skip build validation** - Run `npm run build:test` before merging main

## Session Continuation Checklist

**Always check on session start:**
1. Current branch: `git branch --show-current`
2. Uncommitted changes: `git status --porcelain`  
3. Branch context: Check `BRANCHES.md` and `git config branch.[name].description`
4. Recent activity: `git log --oneline -3`

**Ask if unclear:** Which branch to work on, whether to commit/stash changes, if new branch needed

## Quick Reference Links

📚 **Detailed Documentation:**
- **docs/development/AUTOMATED_SAFEGUARDS_GUIDE.md** - Complete safeguards system
- **docs/development/DOCKER_BUILD_GUIDE.md** - Docker builds, CI/CD, DockerHub integration  
- **docs/development/SETUP_GUIDE.md** - Initial project setup procedures
- **docs/development/TROUBLESHOOTING_ARCHIVE.md** - Historical issues and solutions
- **scripts/WORKTREE_README.md** - Worktree system details

## Environment Setup

**Required Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host:port/db?schema=public
DB_USER=postgres
DB_PASSWORD=[alphanumeric_only]  # PostgreSQL requirement
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tgeld
NODE_ENV=development|production
```

**Docker Development:**
- Use `docker-compose.dev.yml` for development
- Production uses `Dockerfile.prod` with multi-stage build
- Always test in Docker environment before production

## API & Security

**API Pattern**: RESTful endpoints in `/app/api/`
- `GET /api/[resource]` - List
- `POST /api/[resource]` - Create  
- `PUT /api/[resource]/[id]` - Update
- `DELETE /api/[resource]/[id]` - Delete

**Security Model**: PIN-based parent/child mode switching (no user auth)

## Development Principles

- **Follow existing patterns** unless objectively inferior
- **Maintain backwards compatibility** 
- **Keep solutions simple** (KISS principle)
- **Read before writing** - understand existing patterns first
- **Never suggest new features** unless explicitly asked
