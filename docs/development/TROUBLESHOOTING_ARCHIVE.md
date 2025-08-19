# Troubleshooting Archive

**Project**: Taschengeld Family Allowance Tracker  
**Last Updated**: 2025-08-19

This document contains resolved issues and historical troubleshooting information for reference.

## Common Current Issues

### Database Connection Issues
**Issue**: Database connection failures  
**Solution**: Ensure PostgreSQL password is alphanumeric only

### Port Conflicts
**Issue**: Port already in use  
**Solution**: Dev runs on 3300 (Docker) or 3000 (local), DB on 5433 (dev) or 5432 (prod)

### Migration Issues
**Issue**: Database schema out of sync  
**Solution**: Run `npx prisma migrate dev` for development changes

### Git Workflow Issues
- **Unexpected Builds**: Check if working on main branch (triggers CI/CD) vs development branch
- **Lost Changes**: Use `git stash` before switching branches if you have uncommitted changes
- **Wrong Branch**: Check `git branch --show-current` and switch with `git checkout [branch-name]`
- **Merge Conflicts**: When merging development to main, resolve conflicts carefully in your IDE

## Historical Issues (RESOLVED)

### CI/CD Best Practices & Lessons Learned

**Last Updated**: 2025-08-18

#### Key Lessons from Production Build Failures (August 2025)

**Root Cause: Development vs Production Environment Mismatch**  
**Date**: 2025-08-18  
**Impact**: Docker builds failing due to ESLint configuration inconsistencies  

**What Happened:**
- Development environment: ESLint warnings are non-blocking
- Production environment: ESLint warnings become build-stopping errors
- Local development: Never tested production builds (`npm run dev` only)
- CI/CD: Full production build with stricter validation

**Contributing Factors:**
1. **ESLint Configuration Drift**: Quote style and unused variable rules misaligned
2. **Restrictive CI/CD Triggers**: Only triggered on `version.txt` changes
3. **Missing Local Validation**: No step to test production builds locally
4. **Late-Stage Discovery**: Issues only found during Docker build phase

**Solutions Implemented:**
1. ✅ **Added `build:test` Script**: Local production build validation
2. ✅ **Updated CI/CD Triggers**: Now triggers on all main branch changes  
3. ✅ **Added Build Validation Workflow**: PR-based build checks
4. ✅ **Enhanced Documentation**: Pre-merge checklist and validation process
5. ✅ **Fixed ESLint Configuration**: Aligned dev/prod behavior

**Prevention Strategies:**
- 🔧 **Environment Parity**: Ensure dev and prod behave identically
- 🔧 **Early Detection**: Test production builds locally before deployment
- 🔧 **Automated Validation**: PR builds catch issues before merge
- 🔧 **Clear Documentation**: Standardized development workflow

### GitHub Actions Build Issues (RESOLVED 2025-07-08)

#### Primary Build Issue
**Problem**: All GitHub Actions builds failing since ~June 24, 2025  
**Error**: "Error: Required environment variable DB_USER is not set"  
**Location**: "Test Docker image" step in docker-build.yml  
**Root Cause**: Docker entrypoint validates env vars for ANY command, not just server startup  
**Status**: ✅ **FIXED** - Build #16139974565 passed successfully

**Solution Implemented**: Modified docker-entrypoint.sh to detect utility commands vs server startup
- Commands like `node --version` and `ls` now run without database validation
- Server startup still requires full environment validation
- GitHub Actions workflow updated with cleaner test commands

#### Secondary Build Issue
**Problem**: Build failing with `docker-compose: command not found`  
**Solution**: Updated to use modern `docker compose` syntax  
**Status**: ✅ **FIXED** - All critical build steps now pass

#### DockerHub Description Update Failure
**Problem**: "Update Docker Hub description" step failing  
**Error**: `Internal Server Error` when sending PATCH request  
**Location**: peter-evans/dockerhub-description@v3 action  
**Impact**: Minor - all Docker images successfully built and pushed ✅  
**Solution**: Added `continue-on-error: true` to prevent build failures  
**Status**: ✅ **FIXED** - Description update failure no longer blocks CI/CD

### Docker Container Startup Issues (RESOLVED)

#### Container Restart Loop Issue
**Issue**: Container restart loop with "relation does not exist" errors  
**Root Cause**: Database schema not created before data initialization  
**Solution**: Enhanced docker-entrypoint.sh (v1.0.7+) includes:
- Schema validation before data insertion
- Intelligent fallback to `prisma db push` when migrations fail
- Better error diagnostics and retry logic

#### Prisma Multi-Architecture Build Issues (RESOLVED v1.0.9)
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

#### Missing Migrations in Docker Image (FIXED v1.0.11)
**Issue**: Container fails with "No migration found in prisma/migrations" error  
**Root Cause**: Docker COPY command not recursively copying migration subdirectories  
**Solution**: Explicitly copy migrations in Dockerfile.prod (v1.0.11+):

```dockerfile
# OLD (problematic):
COPY prisma ./prisma/

# NEW (working):
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations/
```

## Diagnostic Commands

### Docker Build Diagnostics
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

### Prisma Build Diagnostics
```bash
# Check if image contains runtime Prisma generation (v1.0.9+)
docker run --rm groovycodexyz/taschengeld:latest sh -c "grep -c 'generate_prisma_client' docker-entrypoint.sh"

# Verify image version has the fixes
docker inspect groovycodexyz/taschengeld:latest | grep -A 5 "org.opencontainers.image.version"

# Test multi-architecture build locally
docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.prod -t test-build .
```

### Migration Diagnostics
```bash
# Check if migrations are included in image
docker run --rm groovycodexyz/taschengeld:latest ls -la /app/prisma/migrations/

# Verify SQL files are present
docker run --rm groovycodexyz/taschengeld:latest find /app/prisma/migrations -name "*.sql"
```

### CI/CD Pipeline Diagnostics

#### GitHub Actions Not Triggering
1. Check recent commits for large files: `git show --stat HEAD`
2. Verify .gitignore contains `logs/` entry
3. Check GitHub Actions page for failed workflows
4. Manually trigger release: `gh workflow run release.yml --ref main`

#### Docker Images Not Updated
1. Check GitHub Actions completion status
2. Verify DockerHub credentials in repository secrets
3. Check for failed builds in Actions tab
4. Use build script manually: `./scripts/build-multiarch.sh --push`

#### Large Commit Prevention
- GitHub Actions now validates commit size (<10k lines)
- Automatic detection of large log files
- Enhanced error reporting with troubleshooting steps

#### CI/CD Testing Issues (Fixed in v1.0.9)
- GitHub Actions test step may fail with "Required environment variable DB_USER is not set"
- This is expected behavior - the Docker image now properly validates environment variables
- The build itself succeeds; only the testing phase reports this validation error
- Images are successfully built and pushed to DockerHub despite test "failure"

## Testing Approach

- Manual testing in Docker environment is primary approach
- Automated CI/CD testing with fresh database startup verification
- API endpoint testing included in build script
- Focus on dev-prod parity rather than unit tests

## Related Files

- `.github/workflows/docker-build.yml`: Line 133-137 (failing test)
- `docker-entrypoint.sh`: Line 10-18 (validate_env function), Line 210 (validation call)
- `Dockerfile.prod`: Line 104 (ENTRYPOINT configuration)