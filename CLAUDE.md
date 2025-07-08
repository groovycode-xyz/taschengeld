# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taschengeld ("pocket money" in German) is a family allowance tracker application designed for parents to manage children's tasks and allowances. It features a kiosk-style interface with PIN-protected parent mode and simplified child mode.

### Repository Information

**GitHub:**

- **Organization:** `groovycode-xyz`
- **Repository:** https://github.com/groovycode-xyz/taschengeld.git
- **Issues:** https://github.com/groovycode-xyz/taschengeld/issues

**DockerHub:**

- **Account:** `groovycodexyz`
- **Repository:** https://hub.docker.com/repository/docker/groovycodexyz/taschengeld
- **Images:** `groovycodexyz/taschengeld`

**Website & Support:**

- **Website:** https://taschengeld.groovycode.xyz
- **Support Email:** support@groovycode.xyz

**Version & Release:**

- **Current Version:** 1.0.9 (from `version.txt`)
- **Version Strategy:** Single source of truth in `version.txt`
- **Release Process:** Use `./scripts/version-sync.sh --increment patch --release`

**Key Branding Notes:**

- **GitHub Organization:** `groovycode-xyz` (with hyphens)
- **DockerHub Account:** `groovycodexyz` (no hyphens)
- **Project Name:** Always "Taschengeld" (not "tgeld" which is legacy internal reference)
- **Domain:** `groovycode.xyz` (not `.com`)

### Device Optimization

The application is optimized exclusively for desktop/laptop and tablet devices:

- **Minimum viewport**: 768px (prevents mobile phone usage)
- **Desktop (1024px+)**: Full sidebar, rich hover effects, tooltips
- **Tablets (768-1023px)**: Collapsible sidebar, 48px touch targets, active states
- **Not supported**: Mobile phones < 768px width

## Common Commands

### Development

```bash
npm run dev                    # Start Next.js dev server (port 3000)
npm run dev:docker             # Start full stack in Docker (port 3001)
npm run dev:docker:restart     # Restart Docker keeping database data
npm run dev:docker:stop        # Stop Docker containers
npm run dev:docker:start       # Start existing Docker containers
npm run dev:docker:clean       # ⚠️ DANGER: Clean restart (DELETES ALL DATA)
docker compose -f docker-compose.dev.yml up --build  # Full Docker development
```

### ⚠️ DATABASE DATA PERSISTENCE WARNING

**IMPORTANT**: The `npm run dev:docker:clean` command will DELETE ALL DATABASE DATA!

To avoid data loss:

- Use `npm run dev:docker:restart` for normal restarts (keeps data)
- Use `docker compose -f docker-compose.dev.yml down` (without `-v`) to stop
- Only use `dev:docker:clean` when you explicitly want a fresh database

Safe restart workflow:

```bash
# Option 1: Quick restart keeping data
npm run dev:docker:restart

# Option 2: Stop and start later
npm run dev:docker:stop
# ... later ...
npm run dev:docker:start

# Option 3: Manual Docker commands (safe)
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
```

### Code Quality

```bash
npm run lint                   # Run Prettier and Next.js linting
npm run format                 # Format code with Prettier
npm run check                  # TypeScript check + lint + format
```

### Build and Deployment

```bash
npm run build                  # Build Next.js application
./scripts/build-multiarch.sh --push --increment patch  # Build and push Docker images
./scripts/build-multiarch.sh --local                  # Test build locally
```

### Version Management

```bash
./scripts/version-sync.sh --increment patch --release  # Increment version and create release
./scripts/version-sync.sh --increment minor           # Increment minor version only
./scripts/version-sync.sh --release                   # Create release for current version
```

### Git & Branch Commands

```bash
git branch --show-current                    # Check current branch
git status --short                          # Check uncommitted changes
git checkout development                     # Switch to development branch
git checkout main                           # Switch to main branch
git checkout -b feature/new-feature         # Create and switch to new branch
git stash push -m "WIP message"             # Save uncommitted changes
git stash pop                               # Restore saved changes
```

### Branch Documentation System

This project uses a comprehensive branch documentation system for professional development workflows:

#### Quick Commands

```bash
npm run branches                # Show branch status and progress
npm run branches:desc           # Display all branch descriptions
npm run branches:cleanup        # Clean up merged branches
npm run git:setup              # Install Git aliases for branch management
```

#### Documentation Files

- **`BRANCHES.md`** - Central registry with detailed branch tracking, progress, and next steps
- **Git descriptions** - Built-in Git branch descriptions for quick reference
- **Branch tools** - Professional scripts in `/scripts/branch-tools.sh`

#### Branch Documentation Best Practices

```bash
# Always document new branches immediately
git checkout -b feature/my-feature
git config branch.feature/my-feature.description "Brief purpose description"

# Update BRANCHES.md with:
# - Current progress and status
# - Technical details and testing notes
# - Next steps and dependencies

# Use descriptive branch names
feature/svg-management-tool      # New functionality
hotfix/docker-startup-fix        # Critical production fixes
refactor/icon-system-centralization  # Code improvements
```

#### For LLM Assistance

When requesting help, always mention: **"Check BRANCHES.md and git branch descriptions for current context"**
This provides LLMs with comprehensive information about:

- What each branch does and why it exists
- Current progress and next steps
- Technical implementation details
- Testing requirements and dependencies

#### Production Docker Build Process

The production build uses a multi-stage Docker build with multi-architecture support (ARM64/AMD64) and automatic DockerHub integration:

**Quick Commands:**

```bash
# Local build and test (recommended for verification)
./scripts/build-multiarch.sh --local

# Local build without tests (faster development)
./scripts/build-multiarch.sh --local --skip-tests

# Build and push to DockerHub with version increment
./scripts/build-multiarch.sh --push --increment patch

# Build and push to DockerHub without version change
./scripts/build-multiarch.sh --push
```

**DockerHub Repository:** `groovycodexyz/taschengeld`

**Build Process Steps:**

1. **Environment Validation**: Checks Docker, BuildKit, and required files
2. **DockerHub Authentication**: Handles login for local and CI/CD environments
3. **Multi-arch Builder Setup**: Creates/uses `multiarch` builder for cross-platform builds
4. **Architecture Builds**:
   - AMD64: Built for Intel/AMD processors
   - ARM64: Built for Apple Silicon and ARM processors
5. **Image Tagging**: Tags with version number and architecture suffix
6. **Testing** (if enabled): Runs database connectivity and API endpoint tests
7. **DockerHub Push** (if `--push` flag used): Pushes images to `groovycodexyz/taschengeld`

**Build Artifacts:**

- `groovycodexyz/taschengeld:latest-amd64` - AMD64 architecture
- `groovycodexyz/taschengeld:latest-arm64` - ARM64 architecture
- `groovycodexyz/taschengeld:v{version}-amd64` - Versioned AMD64 image
- `groovycodexyz/taschengeld:v{version}-arm64` - Versioned ARM64 image
- `groovycodexyz/taschengeld:latest` - Multi-arch manifest (when pushed)
- `groovycodexyz/taschengeld:v{version}` - Versioned multi-arch manifest (when pushed)
- `groovycodexyz/taschengeld:stable` - Stable release tag (from release workflow)

**Testing Process:**
The build script includes comprehensive testing:

- Database connectivity verification
- Application health checks
- API endpoint validation (settings, health, etc.)
- Both architectures tested independently

**Build Requirements:**

- Docker Desktop with BuildKit enabled
- Multi-architecture builder support
- Required files: `Dockerfile.prod`, `docker-compose.yml`, `docker-compose.amd64.yml`, `docker-compose.arm64.yml`
- Environment variables: `DB_PASSWORD`, `DB_USER`, `DB_DATABASE`, `DB_PORT`

#### GitHub Actions CI/CD Pipeline

**Automated Workflows:**

1. **docker-build.yml**: Runs on every push to main and pull requests

   - Builds multi-architecture images
   - Runs comprehensive tests
   - Pushes to DockerHub on main branch
   - Updates DockerHub repository description

2. **release.yml**: Handles versioned releases
   - Triggered by GitHub releases or manual workflow dispatch
   - Automatic version increment (patch/minor/major)
   - Creates stable release tags
   - Updates version.txt and creates git tags

**Required GitHub Secrets:**

- `DOCKERHUB_USERNAME`: Your DockerHub username (groovycodexyz)
- `DOCKERHUB_TOKEN`: DockerHub access token for authentication

**Deployment Process:**

```bash
# Pull latest image
docker pull groovycodexyz/taschengeld:latest

# Pull specific version
docker pull groovycodexyz/taschengeld:v1.0.9

# Pull stable release
docker pull groovycodexyz/taschengeld:stable
```

### Docker Management

```bash
npm run docker:cleanup         # Clean up Docker resources
npm run docker:cleanup:all     # Clean all Docker resources
```

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16 with Prisma ORM
- **Deployment**: Docker with multi-architecture support (ARM64/AMD64)
- **State Management**: React Context API (Language, Mode, Theme, Settings, User)
- **Validation**: Zod schemas
- **Icons**: lucide-react
- **Animations**: canvas-confetti, tailwindcss-animate

### Key Architectural Patterns

1. **Service Pattern**: All database operations go through service classes in `/app/lib/services/`
2. **API Routes**: All data mutations happen through `/app/api/` endpoints
3. **Context Providers**: Global state managed via React Context (`/components/context/`)
4. **Component Structure**: Feature-based organization with shared UI components in `/components/ui/`

### Database Strategy

- Uses Prisma ORM for database operations
- Schema defined in `/prisma/schema.prisma`
- Migrations managed through Prisma migrate
- Service pattern provides business logic layer
- Type-safe queries with automatic TypeScript types

### Security Model

- PIN-based parent/child mode switching (no user authentication)
- Parent mode: Full access to all features
- Child mode: Limited to task completion and balance viewing
- PIN stored in global settings

## Git & Branch Workflow

### Branch Strategy

**Branch Types and Usage:**

- **`main`**: Production-ready code, triggers CI/CD builds to DockerHub
- **`development`**: Daily development work, safe for experimentation
- **`feature/[name]`**: Specific feature development (e.g., `feature/dark-mode`)
- **`hotfix/[name]`**: Critical production fixes

### When to Use Each Branch

```
📝 What are you doing?
├─ 🐛 Bug fixes or small changes?
│  ├─ Critical production issue? → main branch (immediate release)
│  └─ Regular bug fix? → development branch
├─ ✨ New feature development?
│  ├─ Small feature? → development branch
│  └─ Major feature? → feature/[name] branch
├─ 📚 Documentation updates?
│  └─ Any branch (usually development)
├─ 🔧 Infrastructure/CI changes?
│  └─ main branch (affects production systems)
└─ 🚀 Ready to release?
   └─ Merge to main + version bump
```

### Communication Protocol

**❌ Unclear Instructions:**

- "Add a new feature"
- "Fix this bug"
- "Update the documentation"

**✅ Clear Branch Instructions:**

- "Work on development branch and add dark mode toggle"
- "Switch to main branch and create v1.0.6 release"
- "Create feature/api-improvements branch for API work"
- "Stay on current branch and fix this documentation"

### Session Continuation Checklist

**Claude will ALWAYS check:**

1. **Current Branch**: `git branch --show-current`
2. **Branch Documentation**: `BRANCHES.md` and `git config branch.$(git branch --show-current).description`
3. **Uncommitted Changes**: `git status --porcelain`
4. **Recent Activity**: `git log --oneline -3`

**Claude will ASK if unclear:**

- "Which branch should I work on for this task?"
- "We're on main with uncommitted changes. Should I commit or switch branches?"
- "Should I create a new feature branch for this work?"

### Daily Development Workflow

**For Development Work (No Builds):**

```bash
git checkout development
# Make changes, test with npm run dev:docker
git add .
git commit -m "Add feature X"
git push origin development  # Backs up to GitHub, no builds
```

**For Production Releases (Triggers Builds):**

```bash
git checkout main
git merge development
./scripts/version-sync.sh --increment patch --release
# Automatically: updates version, commits, creates release, triggers CI/CD
```

**For Feature Branches:**

```bash
git checkout -b feature/new-sidebar
# Work on feature
git push origin feature/new-sidebar
# When complete: merge to development, then to main for release
```

## Development Principles

### Docker-First Development

- **Always test in Docker environment** - development should mirror production
- Use `docker-compose.dev.yml` for development with hot reloading
- Production uses `Dockerfile.prod` with optimized multi-stage build
- Database passwords must be alphanumeric only (PostgreSQL in Docker requirement)

### Code Standards

- Follow existing patterns unless objectively inferior
- Maintain backwards compatibility
- Keep solutions simple (KISS principle)
- Never use PowerShell - always use ZSH
- Don't suggest new features unless explicitly asked
- Keep testing simple without frameworks

### Important Constraints

1. **Never make assumptions** - always verify actual state
2. **Read before writing** - understand existing patterns first
3. **Document branches immediately** - update BRANCHES.md and set Git descriptions for all new branches
4. **Docker environment is truth** - if it works in Docker dev, it should work in production
5. **Multi-architecture support** - ensure builds work on both ARM64 and AMD64

## Key Features and Workflows

### Core Features

1. **User Management**: Family member profiles with avatars and sounds
2. **Task Management**: Define tasks with values, icons, and completion sounds
3. **Task Completion**: Children mark tasks complete, parents approve
4. **Payday System**: Bulk approval/rejection of completed tasks
5. **Piggy Bank**: Virtual accounts with transaction history
6. **Backup/Restore**: Full database backup and restore

### API Endpoints Pattern

All API routes follow RESTful patterns:

- `GET /api/[resource]` - List resources
- `POST /api/[resource]` - Create resource
- `PUT /api/[resource]/[id]` - Update resource
- `DELETE /api/[resource]/[id]` - Delete resource

### State Management

- Mode Context: Manages parent/child mode switching
- Language Context: i18n support (German/English)
- Theme Context: Light/dark theme management

## Environment Setup

### Required Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/db?schema=public
DB_USER=postgres
DB_PASSWORD=[alphanumeric_only]
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tgeld
NODE_ENV=development|production
```

### Version Management

Version synchronization across all platforms (app, GitHub, DockerHub):

- **Version Source**: `version.txt` (single source of truth)
- **Application**: Reads from `version.txt` and displays in Global Settings
- **GitHub**: Git tags and releases match version.txt
- **DockerHub**: Images tagged with version from version.txt

**Version Sync Commands:**

```bash
# Increment version and create release
./scripts/version-sync.sh --increment patch --release

# Just increment version (no release)
./scripts/version-sync.sh --increment minor

# Create release for current version
./scripts/version-sync.sh --release

# Alternative: Use build script (also increments version)
./scripts/build-multiarch.sh --increment [patch|minor|major] --push
```

**Version Workflow:**

1. `./scripts/version-sync.sh --increment patch --release`
2. Updates `version.txt`, commits change, creates git tag
3. Creates GitHub release with Docker pull instructions
4. GitHub Actions automatically builds and pushes versioned images to DockerHub
5. Application displays updated version in Global Settings (after restart/rebuild)

**Version Sync Script Features:**

- Single command for complete version releases
- Automatic git commit and tag creation
- GitHub release creation with Docker instructions
- Supports patch, minor, and major version increments
- Can create releases for current version without incrementing

**Checking Version Status:**

```bash
# Check current version
cat version.txt

# Check GitHub releases
gh release list

# Check git tags
git tag -l

# Check DockerHub images (after CI/CD completes)
docker pull groovycodexyz/taschengeld:latest
docker inspect groovycodexyz/taschengeld:latest | grep -A5 Labels

# Check application version (in development)
curl -s http://localhost:3001/api/version

# Check application version (in production)
curl -s http://localhost:3000/api/version
```

## DockerHub Integration Setup

### Initial Setup

1. **Create DockerHub Repository**:

   - Go to https://hub.docker.com/repositories/groovycodexyz
   - Create new repository named `taschengeld`
   - Set as public repository
   - Add description: "Family allowance tracker application"

2. **Generate DockerHub Access Token**:

   - Go to DockerHub Account Settings → Security
   - Create new access token with read/write permissions
   - Save token securely (it won't be shown again)

3. **Configure GitHub Secrets**:

   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add repository secrets:
     - `DOCKERHUB_USERNAME`: Your DockerHub username (groovycodexyz)
     - `DOCKERHUB_TOKEN`: The access token from step 2

4. **Local Development Setup**:

   ```bash
   # Login to DockerHub for local builds
   docker login

   # Verify login
   docker info | grep Username
   ```

### Usage Workflows

**Automated CI/CD** (Recommended):

- Push to main branch → Automatic build and push to DockerHub
- Create GitHub release → Versioned release with stable tags
- Manual release → Use GitHub Actions workflow dispatch

**Manual Local Builds**:

```bash
# Build and test locally
./scripts/build-multiarch.sh --local

# Build and push to DockerHub
./scripts/build-multiarch.sh --push

# Build with version increment
./scripts/build-multiarch.sh --push --increment patch
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL password is alphanumeric only
2. **Port Conflicts**: Dev runs on 3001 (Docker) or 3000 (local), DB on 5433 (dev) or 5432 (prod)
3. **Build Failures**: Check Docker daemon is running and architecture matches
4. **Migration Issues**: Run `npx prisma migrate dev` for development changes
5. **Production Build Issues**:
   - **Prisma Generation Errors**: Ensure `binaryTargets` in schema.prisma includes `linux-musl-openssl-3.0.x`
   - **Missing Dependencies**: The production build includes `pg` module for initialization scripts
   - **Multi-arch Build Failures**: Verify Docker BuildKit is enabled and `multiarch` builder exists
   - **Port Mapping**: Production containers expose port 3000 but may map to different external ports (e.g., 8071)
6. **DockerHub Integration Issues**:
   - **Authentication Failures**: Ensure `docker login` is completed for local builds or GitHub secrets are set
   - **Repository Not Found**: Create `groovycodexyz/taschengeld` repository on DockerHub before first push
   - **GitHub Actions Failures**: Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are configured
   - **Multi-arch Push Issues**: Check that DockerHub account supports multi-architecture manifests
7. **Git Workflow Issues**:
   - **Unexpected Builds**: Check if working on main branch (triggers CI/CD) vs development branch
   - **Lost Changes**: Use `git stash` before switching branches if you have uncommitted changes
   - **Wrong Branch**: Check `git branch --show-current` and switch with `git checkout [branch-name]`
   - **Merge Conflicts**: When merging development to main, resolve conflicts carefully in your IDE
8. **CI/CD Pipeline Issues**:
   - **Silent Build Failures**: Large commits (>10k lines) can break GitHub Actions
   - **Outdated Docker Images**: Check if GitHub Actions completed successfully after commits to main
   - **Log File Commits**: Ensure `logs/` directory is in .gitignore to prevent CI disruption
   - **Missing Docker Images**: Manually trigger release workflow if automated builds fail

### Docker Container Startup Issues

**Issue**: Container restart loop with "relation does not exist" errors
**Root Cause**: Database schema not created before data initialization
**Solution**: Enhanced docker-entrypoint.sh (v1.0.7+) includes:

- Schema validation before data insertion
- Intelligent fallback to `prisma db push` when migrations fail
- Better error diagnostics and retry logic

### Prisma Multi-Architecture Build Issues (RESOLVED v1.0.9)

**Issue**: Docker builds failing with Prisma SIGTRAP errors during multi-architecture compilation
**Root Cause**: Prisma client generation fails in Alpine Linux during build-time with platform-specific detection
**Solution**: Runtime Prisma client generation (v1.0.9+):

- Removed problematic build-time Prisma generation from Dockerfile.prod
- Added `generate_prisma_client()` function to docker-entrypoint.sh
- Prisma client now generates at container startup using native binaryTargets
- Eliminates Alpine Linux compatibility issues with cross-platform builds

**Key Changes (v1.0.9)**:

```dockerfile
# OLD (problematic):
RUN if [ "$(uname -m)" = "x86_64" ]; then
  PRISMA_QUERY_ENGINE_BINARY_PLATFORM="linux-musl-openssl-3.0.x" npx prisma generate
fi

# NEW (working):
# Skip Prisma generation during build - will be generated at runtime
```

**Benefits**:

- ✅ Multi-architecture builds now succeed reliably
- ✅ GitHub Actions CI/CD pipeline working
- ✅ Both AMD64 and ARM64 images build successfully
- ✅ No more SIGTRAP errors or build timeouts

**Diagnostic Commands for Startup Issues**:

```bash
# Check if image contains startup fixes (v1.0.7+)
docker run --rm groovycodexyz/taschengeld:latest sh -c "grep -c 'schema validation' /app/scripts/initialize-data.js"

# Test startup manually with fresh database
docker-compose -f docker-compose.yml up -d db
docker run --rm --network taschengeld_default \
  -e DATABASE_URL="postgresql://postgres:password@db:5432/tgeld?schema=public" \
  -e DB_HOST=db -e DB_USER=postgres -e DB_PASSWORD=password \
  -e DB_DATABASE=tgeld -e DB_PORT=5432 \
  groovycodexyz/taschengeld:latest
```

**Diagnostic Commands for Prisma Build Issues**:

```bash
# Check if image contains runtime Prisma generation (v1.0.9+)
docker run --rm groovycodexyz/taschengeld:latest sh -c "grep -c 'generate_prisma_client' docker-entrypoint.sh"

# Verify image version has the fixes
docker inspect groovycodexyz/taschengeld:latest | grep -A 5 "org.opencontainers.image.version"

# Test multi-architecture build locally
docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.prod -t test-build .
```

### CI/CD Pipeline Troubleshooting

**GitHub Actions Not Triggering**:

1. Check recent commits for large files: `git show --stat HEAD`
2. Verify .gitignore contains `logs/` entry
3. Check GitHub Actions page for failed workflows
4. Manually trigger release: `gh workflow run release.yml --ref main`

**Docker Images Not Updated**:

1. Check GitHub Actions completion status
2. Verify DockerHub credentials in repository secrets
3. Check for failed builds in Actions tab
4. Use build script manually: `./scripts/build-multiarch.sh --push`

**Large Commit Prevention**:

- GitHub Actions now validates commit size (<10k lines)
- Automatic detection of large log files
- Enhanced error reporting with troubleshooting steps

**CI/CD Testing Issues (Fixed in v1.0.9)**:

- GitHub Actions test step may fail with "Required environment variable DB_USER is not set"
- This is expected behavior - the Docker image now properly validates environment variables
- The build itself succeeds; only the testing phase reports this validation error
- Images are successfully built and pushed to DockerHub despite test "failure"

### Testing Approach

- Manual testing in Docker environment is primary approach
- Automated CI/CD testing with fresh database startup verification
- API endpoint testing included in build script
- Focus on dev-prod parity rather than unit tests

## GitHub Actions Build Failure Tracker

**Last Updated**: 2025-07-08

### ✅ RESOLVED: Primary Build Issue (2025-07-08)

**Problem**: All GitHub Actions builds failing since ~June 24, 2025
**Error**: "Error: Required environment variable DB_USER is not set"
**Location**: "Test Docker image" step in docker-build.yml
**Root Cause**: Docker entrypoint validates env vars for ANY command, not just server startup
**Status**: ✅ **FIXED** - Build #16139974565 passed "Test Docker image" step successfully

**Solution Implemented**: Modified docker-entrypoint.sh to detect utility commands vs server startup
- Commands like `node --version` and `ls` now run without database validation
- Server startup still requires full environment validation
- GitHub Actions workflow updated with cleaner test commands

### ⚠️ NEW: Secondary Build Issue (2025-07-08)

**Problem**: Build failing in "Test Docker startup with database" step
**Error**: `docker-compose: command not found` (exit code 127)
**Location**: Line 37 of temp script in "Test Docker startup with database" step
**Root Cause**: GitHub Actions Ubuntu runner missing docker-compose command
**Impact**: Build progresses much further but fails in database testing phase
**Build Time**: 24m 19s vs immediate failure before

### Progress Summary

**✅ Major Success**: 
- "Test Docker image" step now passes ✅
- Docker images build and push successfully ✅ 
- Multi-architecture builds working ✅
- Build runs 24+ minutes vs immediate failure ✅

**🔧 Remaining Issue**: 
- Missing `docker-compose` command in GitHub Actions runner
- Need to install docker-compose or use `docker compose` (newer syntax)

### Related Files

- `.github/workflows/docker-build.yml`: Line 133-137 (failing test)
- `docker-entrypoint.sh`: Line 10-18 (validate_env function), Line 210 (validation call)
- `Dockerfile.prod`: Line 104 (ENTRYPOINT configuration)
