#!/bin/bash

# Version Synchronization Script
# Ensures version.txt, git tags, and releases are synchronized

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to log messages
log() {
    local level=$1
    shift
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] [$level]${NC} $*"
}

# Function to increment version
increment_version() {
    local version_type=$1
    local current_version=$2
    local major minor patch
    
    # Split version into components
    IFS='.' read -r major minor patch <<< "$current_version"
    
    case $version_type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "Invalid version type. Use: major, minor, or patch"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Parse command line arguments
VERSION_TYPE=""
CREATE_RELEASE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --increment)
            VERSION_TYPE="$2"
            shift 2
            ;;
        --release)
            CREATE_RELEASE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [--increment patch|minor|major] [--release]"
            echo ""
            echo "Options:"
            echo "  --increment TYPE    Increment version (patch, minor, or major)"
            echo "  --release          Create GitHub release after version update"
            echo "  --help             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --increment patch --release"
            echo "  $0 --increment minor"
            exit 0
            ;;
        *)
            log "ERROR" "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Get current version
CURRENT_VERSION=$(cat version.txt 2>/dev/null || echo "1.0.0")
log "INFO" "Current version: $CURRENT_VERSION"

# Calculate new version if increment requested
if [ -n "$VERSION_TYPE" ]; then
    NEW_VERSION=$(increment_version "$VERSION_TYPE" "$CURRENT_VERSION")
    log "INFO" "New version: $NEW_VERSION"
    
    # Update version.txt
    echo "$NEW_VERSION" > version.txt
    log "SUCCESS" "Updated version.txt to $NEW_VERSION"
    
    # Commit version change
    git add version.txt
    git commit -m "🔖 Bump version to v$NEW_VERSION"
    log "SUCCESS" "Committed version change"
    
    # Create and push git tag
    git tag "v$NEW_VERSION"
    git push origin HEAD --tags
    log "SUCCESS" "Created and pushed git tag v$NEW_VERSION"
    
    CURRENT_VERSION="$NEW_VERSION"
fi

# Create GitHub release if requested
if [ "$CREATE_RELEASE" = true ]; then
    log "INFO" "Creating GitHub release for v$CURRENT_VERSION"
    log "INFO" "Generating intelligent release notes from git commits..."
    
    # Generate intelligent release notes using our Python script
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    RELEASE_NOTES_SCRIPT="$SCRIPT_DIR/generate-release-notes.py"
    
    if [ -f "$RELEASE_NOTES_SCRIPT" ]; then
        # Use Python script to generate smart release notes
        RELEASE_NOTES=$(python3 "$RELEASE_NOTES_SCRIPT" "$CURRENT_VERSION" 2>/dev/null)
        
        if [ $? -eq 0 ] && [ -n "$RELEASE_NOTES" ]; then
            log "SUCCESS" "Generated intelligent release notes based on commit analysis"
        else
            log "WARN" "Failed to generate intelligent notes, falling back to basic template"
            RELEASE_NOTES="$(cat <<EOF
## 🚀 Release v$CURRENT_VERSION

### 📝 Changes
- Version maintenance and updates

### 📦 Docker Images
- \`docker pull groovycodexyz/taschengeld:v$CURRENT_VERSION\`
- \`docker pull groovycodexyz/taschengeld:latest\`

### 🏗️ Multi-Architecture Support
- ✅ linux/amd64 (Intel/AMD processors)
- ✅ linux/arm64 (Apple Silicon, ARM processors)

### 📥 Installation
\`\`\`bash
docker pull groovycodexyz/taschengeld:v$CURRENT_VERSION
\`\`\`

For full setup instructions, see: https://taschengeld.groovycode.xyz

---
🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
        fi
    else
        log "WARN" "Release notes generator not found at $RELEASE_NOTES_SCRIPT"
        log "INFO" "Using basic release notes template"
        RELEASE_NOTES="$(cat <<EOF
## 🚀 Release v$CURRENT_VERSION

### 📝 Changes
- Version maintenance and updates

### 📦 Docker Images
- \`docker pull groovycodexyz/taschengeld:v$CURRENT_VERSION\`
- \`docker pull groovycodexyz/taschengeld:latest\`

### 🏗️ Multi-Architecture Support
- ✅ linux/amd64 (Intel/AMD processors)
- ✅ linux/arm64 (Apple Silicon, ARM processors)

### 📥 Installation
\`\`\`bash
docker pull groovycodexyz/taschengeld:v$CURRENT_VERSION
\`\`\`

For full setup instructions, see: https://taschengeld.groovycode.xyz

---
🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
    fi
    
    # Create the GitHub release with generated notes
    gh release create "v$CURRENT_VERSION" \
        --title "Release v$CURRENT_VERSION" \
        --notes "$RELEASE_NOTES" \
        --latest
    
    log "SUCCESS" "Created GitHub release: https://github.com/groovycode-xyz/taschengeld/releases/tag/v$CURRENT_VERSION"
fi

log "INFO" "Version synchronization completed!"
log "INFO" "Current version: $CURRENT_VERSION"
log "INFO" "Git tag: v$CURRENT_VERSION"
log "INFO" "Application version: Check /global-settings in app"
log "INFO" "DockerHub images: groovycodexyz/taschengeld:v$CURRENT_VERSION"