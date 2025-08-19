# Docker Build Guide

**Project**: Taschengeld Family Allowance Tracker  
**Last Updated**: 2025-08-19

## Overview

The Taschengeld project uses multi-architecture Docker builds with comprehensive testing and automatic DockerHub integration.

## Quick Commands

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

## DockerHub Repository

**Repository**: `groovycodexyz/taschengeld`  
**URL**: https://hub.docker.com/repository/docker/groovycodexyz/taschengeld

## Build Process Steps

1. **Environment Validation**: Checks Docker, BuildKit, and required files
2. **DockerHub Authentication**: Handles login for local and CI/CD environments
3. **Multi-arch Builder Setup**: Creates/uses `multiarch` builder for cross-platform builds
4. **Architecture Builds**:
   - AMD64: Built for Intel/AMD processors
   - ARM64: Built for Apple Silicon and ARM processors
5. **Image Tagging**: Tags with version number and architecture suffix
6. **Testing** (if enabled): Runs database connectivity and API endpoint tests
7. **DockerHub Push** (if `--push` flag used): Pushes images to `groovycodexyz/taschengeld`

## Build Artifacts

- `groovycodexyz/taschengeld:latest-amd64` - AMD64 architecture
- `groovycodexyz/taschengeld:latest-arm64` - ARM64 architecture
- `groovycodexyz/taschengeld:v{version}-amd64` - Versioned AMD64 image
- `groovycodexyz/taschengeld:v{version}-arm64` - Versioned ARM64 image
- `groovycodexyz/taschengeld:latest` - Multi-arch manifest (when pushed)
- `groovycodexyz/taschengeld:v{version}` - Versioned multi-arch manifest (when pushed)
- `groovycodexyz/taschengeld:stable` - Stable release tag (from release workflow)

## Testing Process

The build script includes comprehensive testing:

- Database connectivity verification
- Application health checks
- API endpoint validation (settings, health, etc.)
- Both architectures tested independently

## Build Requirements

- Docker Desktop with BuildKit enabled
- Multi-architecture builder support
- Required files: `Dockerfile.prod`, `docker-compose.yml`, `docker-compose.amd64.yml`, `docker-compose.arm64.yml`
- Environment variables: `DB_PASSWORD`, `DB_USER`, `DB_DATABASE`, `DB_PORT`

## GitHub Actions CI/CD Pipeline

### Automated Workflows

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

### Required GitHub Secrets

- `DOCKERHUB_USERNAME`: Your DockerHub username (groovycodexyz)
- `DOCKERHUB_TOKEN`: DockerHub access token for authentication

## Deployment Process

```bash
# Pull latest image
docker pull groovycodexyz/taschengeld:latest

# Pull specific version
docker pull groovycodexyz/taschengeld:v1.2.0

# Pull stable release
docker pull groovycodexyz/taschengeld:stable
```

## Troubleshooting Docker Builds

### Common Build Issues

1. **Multi-arch Build Failures**: Verify Docker BuildKit is enabled and `multiarch` builder exists
2. **Authentication Failures**: Ensure `docker login` is completed for local builds
3. **Repository Not Found**: Create `groovycodexyz/taschengeld` repository on DockerHub before first push
4. **Port Mapping**: Production containers expose port 3000 internally but map to external port 8071 by default

### Diagnostic Commands

```bash
# Test multi-architecture build locally
docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.prod -t test-build .

# Check if image contains expected components
docker run --rm groovycodexyz/taschengeld:latest ls -la /app

# Verify image version
docker inspect groovycodexyz/taschengeld:latest | grep -A 5 "org.opencontainers.image.version"
```

## Local Development Setup

### Initial DockerHub Setup

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

## Usage Workflows

### Automated CI/CD (Recommended)

- Push to main branch → Automatic build and push to DockerHub
- Create GitHub release → Versioned release with stable tags
- Manual release → Use GitHub Actions workflow dispatch

### Manual Local Builds

```bash
# Build and test locally
./scripts/build-multiarch.sh --local

# Build and push to DockerHub
./scripts/build-multiarch.sh --push

# Build with version increment
./scripts/build-multiarch.sh --push --increment patch
```

## Related Files

- `Dockerfile.prod` - Production Docker build configuration
- `docker-compose.yml` - Production Docker Compose
- `docker-compose.dev.yml` - Development Docker Compose
- `scripts/build-multiarch.sh` - Multi-architecture build script
- `.github/workflows/docker-build.yml` - CI/CD build workflow
- `.github/workflows/release.yml` - Release workflow
