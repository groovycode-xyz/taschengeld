#!/bin/bash

# Taschengeld Branch Management Tools
# Professional Git branch documentation and management utilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
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

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Function to show all branch descriptions
show_branch_descriptions() {
    print_header "Git Branch Descriptions"
    
    echo "Current branches with descriptions:"
    echo
    
    local current_branch=$(git branch --show-current)
    
    for branch in $(git for-each-ref --format='%(refname:short)' refs/heads/); do
        local desc=$(git config branch.$branch.description 2>/dev/null || echo "No description")
        local marker=""
        
        if [ "$branch" = "$current_branch" ]; then
            marker="${GREEN}*${NC} "
        else
            marker="  "
        fi
        
        echo -e "${marker}${PURPLE}$branch${NC}"
        echo -e "    ${desc}"
        echo
    done
}

# Function to set branch description
set_branch_description() {
    local branch_name=$1
    local description=$2
    
    if [ -z "$branch_name" ] || [ -z "$description" ]; then
        print_error "Usage: set_branch_description <branch_name> <description>"
        return 1
    fi
    
    git config branch.$branch_name.description "$description"
    print_success "Set description for branch '$branch_name'"
}

# Function to create documented branch
create_documented_branch() {
    local branch_name=$1
    local description=$2
    
    if [ -z "$branch_name" ]; then
        echo -n "Branch name: "
        read branch_name
    fi
    
    if [ -z "$description" ]; then
        echo -n "Branch description: "
        read description
    fi
    
    # Create branch
    git checkout -b "$branch_name"
    
    # Set description
    git config branch.$branch_name.description "$description"
    
    # Create branch documentation file
    cat > BRANCH.md << EOF
# Branch: $branch_name

## Purpose
$description

## Tasks
- [ ] Task 1
- [ ] Task 2  
- [ ] Task 3

## Testing Checklist
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] Documentation updated

## Notes
Created: $(date)
EOF

    git add BRANCH.md
    git commit -m "docs: Create branch documentation for $branch_name"
    
    print_success "Created documented branch: $branch_name"
    print_info "Description: $description"
    print_info "Branch documentation: BRANCH.md"
}

# Function to show branch status summary  
show_branch_status() {
    print_header "Branch Status Summary"
    
    local current_branch=$(git branch --show-current)
    print_info "Current branch: $current_branch"
    
    # Check if working directory is clean
    if [ -z "$(git status --porcelain)" ]; then
        print_success "Working directory is clean"
    else
        print_warning "You have uncommitted changes"
        git status --short
    fi
    
    echo
    print_header "Branch Comparison with Development"
    
    # Show ahead/behind status for current branch
    if [ "$current_branch" != "development" ]; then
        local ahead=$(git rev-list --count development..$current_branch 2>/dev/null || echo "0")
        local behind=$(git rev-list --count $current_branch..development 2>/dev/null || echo "0")
        
        echo -e "Branch ${PURPLE}$current_branch${NC}:"
        echo -e "  Ahead of development: ${GREEN}$ahead${NC} commits"
        echo -e "  Behind development: ${YELLOW}$behind${NC} commits"
        
        if [ "$behind" -gt "0" ]; then
            print_warning "Consider merging development into your branch: git merge development"
        fi
    fi
}

# Function to clean up merged branches
cleanup_merged_branches() {
    print_header "Branch Cleanup"
    
    print_info "Finding branches that have been merged to development..."
    
    local merged_branches=$(git branch --merged development | grep -v "development" | grep -v "main" | grep -v "\*" | xargs)
    
    if [ -z "$merged_branches" ]; then
        print_success "No merged branches to clean up"
        return
    fi
    
    echo "The following branches have been merged to development:"
    for branch in $merged_branches; do
        echo -e "  ${YELLOW}$branch${NC}"
    done
    
    echo
    read -p "Delete these branches? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        for branch in $merged_branches; do
            git branch -d "$branch"
            print_success "Deleted branch: $branch"
        done
    else
        print_info "No branches deleted"
    fi
}

# Function to update BRANCHES.md file
update_branches_md() {
    print_header "Updating BRANCHES.md"
    
    if [ ! -f "BRANCHES.md" ]; then
        print_error "BRANCHES.md not found. Please create it first."
        return 1
    fi
    
    # Update the last updated date
    sed -i.bak "s/\*\*Last Updated:\*\* .*/\*\*Last Updated:\*\* $(date +'%Y-%m-%d')/" BRANCHES.md
    
    # Count active branches (excluding main)
    local branch_count=$(git branch | grep -v "main" | wc -l | xargs)
    sed -i.bak "s/\*\*Current Active Branches:\*\* .*/\*\*Current Active Branches:\*\* $branch_count (excluding main)/" BRANCHES.md
    
    print_success "Updated BRANCHES.md metadata"
}

# Main menu
show_menu() {
    print_header "Taschengeld Branch Management Tools"
    
    echo "Available commands:"
    echo
    echo "  1) show-descriptions     - Show all branch descriptions"
    echo "  2) set-description      - Set description for current/specified branch"  
    echo "  3) create-branch        - Create new documented branch"
    echo "  4) status               - Show branch status summary"
    echo "  5) cleanup              - Clean up merged branches"
    echo "  6) update-registry      - Update BRANCHES.md file"
    echo
    echo "Usage: $0 <command> [args...]"
    echo
}

# Main execution
case "${1:-menu}" in
    "show-descriptions"|"desc")
        show_branch_descriptions
        ;;
    "set-description"|"set")
        set_branch_description "$2" "$3"
        ;;
    "create-branch"|"create")
        create_documented_branch "$2" "$3"
        ;;
    "status")
        show_branch_status
        ;;
    "cleanup")
        cleanup_merged_branches
        ;;
    "update-registry"|"update")
        update_branches_md
        ;;
    "menu"|"help"|*)
        show_menu
        ;;
esac