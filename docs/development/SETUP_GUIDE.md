# Setup Guide

**Project**: Taschengeld Family Allowance Tracker  
**Last Updated**: 2025-08-19

This guide covers one-time setup procedures for the Taschengeld project.

## Environment Requirements

- **Node.js**: 18+
- **npm**: Latest version
- **Docker**: Desktop with BuildKit enabled
- **Git**: Latest version
- **Python**: 3.x (for automated safeguards hooks)

## Initial Project Setup

### 1. Repository Clone
```bash
git clone https://github.com/groovycode-xyz/taschengeld.git
cd taschengeld
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/tgeld?schema=public
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5433
DB_DATABASE=tgeld
NODE_ENV=development
```

### 3. Database Setup
```bash
# Start development database
npm run dev:docker

# Initialize database schema
npx prisma migrate dev
npx prisma generate
```

## Multi-Branch Worktree Setup

### Initial Worktree Configuration
```bash
# Run setup script
./scripts/setup-multitasking.sh

# Set up worktree alias
echo 'alias wt="./scripts/worktree-manager.sh"' >> ~/.zshrc
source ~/.zshrc

# Verify setup
wt --list
```

### Branch Documentation Setup
```bash
# Install Git aliases for branch management
npm run git:setup

# Initialize branch documentation
npm run branches
```

## DockerHub Integration Setup

### 1. Create DockerHub Repository
- Go to https://hub.docker.com/repositories/groovycodexyz
- Create new repository named `taschengeld`
- Set as public repository
- Add description: "Family allowance tracker application"

### 2. Generate DockerHub Access Token
- Go to DockerHub Account Settings → Security
- Create new access token with read/write permissions
- Save token securely (it won't be shown again)

### 3. Configure GitHub Secrets
- Go to GitHub repository → Settings → Secrets and variables → Actions
- Add repository secrets:
  - `DOCKERHUB_USERNAME`: Your DockerHub username (groovycodexyz)
  - `DOCKERHUB_TOKEN`: The access token from step 2

### 4. Local Development Setup
```bash
# Login to DockerHub for local builds
docker login

# Verify login
docker info | grep Username
```

## Multi-Architecture Docker Setup

### Docker Buildx Configuration
```bash
# Create multi-architecture builder
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap

# Verify multi-arch support
docker buildx ls
```

### Test Local Build
```bash
# Test build without pushing
./scripts/build-multiarch.sh --local

# Test build with push (after DockerHub setup)
./scripts/build-multiarch.sh --push
```

## Automated Safeguards Setup

The automated safeguards system is automatically configured through:
- `.claude/settings.json` - Hook configuration
- `.claude/hooks/` - Hook scripts  
- `.github/workflows/` - CI/CD workflows

### Verify Safeguards
```bash
# Check hook scripts are executable
ls -la .claude/hooks/*.py

# Test Python 3 availability
python3 --version

# Verify build validation command exists
npm run build:test
```

## Development Environment Verification

### Test Development Stack
```bash
# Start development environment
npm run dev:docker

# In another terminal, verify services
curl http://localhost:3300/api/health
```

### Test Build Process
```bash
# Test local build validation
npm run build:test

# Test Docker build
./scripts/build-multiarch.sh --local
```

### Test Git Workflow
```bash
# Check current branch
git branch --show-current

# Test worktree creation
wt test-setup
# This should open VS Code in new worktree

# Clean up test worktree
wt --clean
```

## IDE Setup

### VS Code Extensions (Recommended)
- TypeScript and JavaScript Language Server
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Prisma
- GitLens
- Docker

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## GitHub Repository Configuration

### Branch Protection Rules

For `main` branch:
- ✅ Require status checks to pass before merging
  - PR Validation workflow
  - Build Validation workflow
- ✅ Require branches to be up to date before merging
- ✅ Require pull request reviews before merging
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Restrict pushes that create files: No direct pushes to main

For `development` branch:
- ✅ Require status checks to pass before merging
  - Build Validation workflow

## Version Management Setup

### Version Source Configuration
The project uses `version.txt` as the single source of truth for versioning.

```bash
# Check current version
cat version.txt

# Test version sync script
./scripts/version-sync.sh --increment patch --release
```

## Verification Checklist

After setup, verify these work correctly:

### ✅ Development Environment
- [ ] `npm run dev` starts Next.js locally
- [ ] `npm run dev:docker` starts full stack
- [ ] Database connection works
- [ ] Hot reloading functions

### ✅ Build Process
- [ ] `npm run build:test` passes
- [ ] `./scripts/build-multiarch.sh --local` succeeds
- [ ] TypeScript compilation works
- [ ] Prettier formatting works

### ✅ Git Workflow
- [ ] Worktree creation works (`wt test-feature`)
- [ ] Branch documentation updates (`npm run branches`)
- [ ] Git aliases function (`git branches`, `git cleanup`)

### ✅ Docker Integration
- [ ] DockerHub login successful
- [ ] Multi-arch builder configured
- [ ] Local Docker builds succeed
- [ ] Push to DockerHub works (if configured)

### ✅ Automated Safeguards
- [ ] Claude Code hooks are executable
- [ ] Pre-commit validation works
- [ ] Pre-push validation works
- [ ] Auto-formatting functions

## Troubleshooting Setup Issues

### Common Setup Problems

**Node.js Version Issues**
```bash
# Use Node Version Manager
nvm install 18
nvm use 18
```

**Docker Permission Issues**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
# Then logout and login again
```

**Python Not Found**
```bash
# Install Python 3 (macOS with Homebrew)
brew install python3

# Verify installation
python3 --version
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :3000
lsof -i :3300
lsof -i :5433

# Kill process if needed
kill -9 [PID]
```

### Setup Verification Commands

```bash
# Verify all requirements
node --version          # Should show v18+
npm --version           # Should show npm version
docker --version        # Should show Docker version
python3 --version       # Should show Python 3.x
git --version           # Should show Git version

# Test project commands
npm run build:test      # Should pass
npm run dev:docker      # Should start services
wt --list              # Should show worktrees
```

## Related Documentation

- **../../CLAUDE.md** - Main development guide
- **DOCKER_BUILD_GUIDE.md** - Docker build details
- **AUTOMATED_SAFEGUARDS_GUIDE.md** - Safeguards system
- **TROUBLESHOOTING_ARCHIVE.md** - Historical issues
- **../../scripts/WORKTREE_README.md** - Worktree system details