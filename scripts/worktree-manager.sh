#!/bin/bash

# Worktree Manager Script for Taschengeld
# Usage: wt <branch-name> [base-branch]
# Example: wt feature/new-feature
# Example: wt hotfix/critical-fix main

set -e

# Configuration
PROJECT_NAME="taschengeld"
PARENT_DIR="/Users/jamespace/Projects"
MAIN_PROJECT_DIR="$PARENT_DIR/$PROJECT_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "Taschengeld Worktree Manager"
    echo ""
    echo "Usage:"
    echo "  wt <branch-name> [base-branch]     Create new worktree"
    echo "  wt --list                          List all worktrees"
    echo "  wt --clean                         Clean up merged worktrees"
    echo "  wt --help                          Show this help"
    echo ""
    echo "Examples:"
    echo "  wt mode-persistence                Create worktree from development branch"
    echo "  wt critical-fix main               Create worktree from main branch"
    echo "  wt saas-development                Create worktree from development branch"
    echo ""
}

# Function to list worktrees
list_worktrees() {
    print_info "Current worktrees:"
    cd "$MAIN_PROJECT_DIR"
    git worktree list | while read -r line; do
        echo "  $line"
    done
}

# Function to clean up merged worktrees
clean_worktrees() {
    print_info "Cleaning up merged worktrees..."
    cd "$MAIN_PROJECT_DIR"
    
    # Get list of worktrees (excluding main project)
    git worktree list --porcelain | grep -A1 "^worktree" | grep -v "^worktree $MAIN_PROJECT_DIR$" | while read -r line; do
        if [[ $line == worktree* ]]; then
            worktree_path=$(echo "$line" | cut -d' ' -f2)
            continue
        fi
        if [[ $line == branch* ]]; then
            branch_name=$(echo "$line" | cut -d' ' -f2 | sed 's|refs/heads/||')
            
            # Check if branch is merged into main
            if git merge-base --is-ancestor "$branch_name" main 2>/dev/null; then
                print_warning "Branch '$branch_name' is merged. Remove worktree at $worktree_path? (y/N)"
                read -r response
                if [[ "$response" =~ ^[Yy]$ ]]; then
                    git worktree remove "$worktree_path"
                    print_success "Removed worktree: $worktree_path"
                fi
            fi
        fi
    done
}

# Main function to create worktree
create_worktree() {
    local branch_name="$1"
    local base_branch="${2:-development}"
    
    # Validate inputs
    if [[ -z "$branch_name" ]]; then
        print_error "Branch name is required"
        show_usage
        exit 1
    fi
    
    # Ensure we're in the main project directory
    if [[ ! -d "$MAIN_PROJECT_DIR" ]]; then
        print_error "Main project directory not found: $MAIN_PROJECT_DIR"
        exit 1
    fi
    
    cd "$MAIN_PROJECT_DIR"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        exit 1
    fi
    
    # Create worktree directory name (simpler approach like the video)
    local worktree_name="${PROJECT_NAME}-worktrees"
    local worktree_parent="$PARENT_DIR/$worktree_name"
    local worktree_path="$worktree_parent/$branch_name"
    
    print_info "Creating worktree: $worktree_name"
    print_info "Branch: $branch_name"
    print_info "Base branch: $base_branch"
    print_info "Path: $worktree_path"
    
    # Create parent worktrees directory if it doesn't exist
    mkdir -p "$worktree_parent"
    
    # Check if worktree already exists
    if [[ -d "$worktree_path" ]]; then
        print_error "Worktree directory already exists: $worktree_path"
        exit 1
    fi
    
    # Ensure base branch exists and is up to date
    if ! git show-ref --verify --quiet "refs/heads/$base_branch"; then
        print_error "Base branch '$base_branch' does not exist"
        exit 1
    fi
    
    # Update base branch
    print_info "Updating base branch: $base_branch"
    git fetch origin "$base_branch"
    git checkout "$base_branch"
    git pull origin "$base_branch"
    
    # Check if branch already exists
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        print_info "Branch '$branch_name' already exists, checking out existing branch"
        git worktree add "$worktree_path" "$branch_name"
    else
        print_info "Creating new branch '$branch_name' from '$base_branch'"
        git worktree add -b "$branch_name" "$worktree_path" "$base_branch"
    fi
    
    # Set up branch description
    cd "$worktree_path"
    print_info "Setting up branch description..."
    read -p "Enter branch description: " description
    if [[ -n "$description" ]]; then
        git config branch."$branch_name".description "$description"
    fi
    
    # Copy .env file if it exists (like in the video)
    if [[ -f "$MAIN_PROJECT_DIR/.env" ]]; then
        cp "$MAIN_PROJECT_DIR/.env" "$worktree_path/.env"
        print_success "Copied .env into worktree"
    fi
    
    # List of hidden folders to copy if they exist (like in the video)
    local hidden_dirs=(.claude .cursor .vscode)
    
    for dir in "${hidden_dirs[@]}"; do
        if [[ -d "$MAIN_PROJECT_DIR/$dir" ]]; then
            cp -r "$MAIN_PROJECT_DIR/$dir" "$worktree_path/$dir"
            print_success "Copied $dir into worktree"
        fi
    done
    
    # Update BRANCHES.md if it exists
    if [[ -f "BRANCHES.md" ]]; then
        print_info "Remember to update BRANCHES.md with your new branch details"
    fi
    
    print_success "Worktree created successfully!"
    print_info "Worktree location: $worktree_path"
    print_info "Branch: $branch_name"
    
    # Open VS Code in the new worktree (like cursor in the video)
    print_info "Opening VS Code in new worktree..."
    code "$worktree_path" &
    
    print_success "Setup complete! You can now work on '$branch_name' independently."
    print_info "To switch back to main project, use: cd $MAIN_PROJECT_DIR"
    print_info "To list all worktrees, use: wt --list"
}

# Main script logic
case "${1:-}" in
    --help|-h)
        show_usage
        ;;
    --list|-l)
        list_worktrees
        ;;
    --clean|-c)
        clean_worktrees
        ;;
    "")
        print_error "No arguments provided"
        show_usage
        exit 1
        ;;
    *)
        create_worktree "$1" "$2"
        ;;
esac