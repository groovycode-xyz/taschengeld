#!/bin/bash

# Complete Setup for Claude Code Multitasking with Worktrees
# Based on the YouTube video workflow

set -e

PROJECT_DIR="/Users/jamespace/Projects/taschengeld"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}🚀 $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

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

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local all_good=true
    
    # Check if we're in the right directory
    if [[ ! -d "$PROJECT_DIR" ]]; then
        print_error "Project directory not found: $PROJECT_DIR"
        all_good=false
    fi
    
    # Check if git is available
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed or not in PATH"
        all_good=false
    fi
    
    # Check if this is a git repository
    if ! git -C "$PROJECT_DIR" rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a git repository: $PROJECT_DIR"
        all_good=false
    fi
    
    # Check if VS Code is available
    if ! command -v code &> /dev/null; then
        print_warning "VS Code 'code' command not found. Install with: Command Palette → 'Shell Command: Install code command in PATH'"
    fi
    
    # Check if Claude Code is available
    if ! command -v claude &> /dev/null; then
        print_warning "Claude Code not found. Install from: https://claude.ai/code"
    fi
    
    if $all_good; then
        print_success "All prerequisites met!"
    else
        print_error "Please fix the above issues before proceeding"
        exit 1
    fi
    
    echo ""
}

# Function to set up shell aliases
setup_aliases() {
    print_header "Setting up Shell Aliases"
    
    # Create aliases for zsh
    if [[ -f ~/.zshrc ]]; then
        print_info "Adding aliases to ~/.zshrc..."
        
        # Check if aliases already exist
        if grep -q "# Taschengeld Worktree Aliases" ~/.zshrc; then
            print_info "Aliases already exist in ~/.zshrc"
        else
            cat >> ~/.zshrc << 'EOF'

# Taschengeld Worktree Aliases
alias wt="/Users/jamespace/Projects/taschengeld/scripts/worktree-manager.sh"
alias ports="/Users/jamespace/Projects/taschengeld/scripts/port-manager.sh"
alias wthelp="/Users/jamespace/Projects/taschengeld/scripts/worktree-manager.sh --help"

EOF
            print_success "Added aliases to ~/.zshrc"
        fi
    else
        print_warning "~/.zshrc not found. Creating minimal version..."
        echo 'alias wt="/Users/jamespace/Projects/taschengeld/scripts/worktree-manager.sh"' > ~/.zshrc
        print_success "Created ~/.zshrc with worktree alias"
    fi
    
    # Source the aliases for current session
    source ~/.zshrc 2>/dev/null || true
    
    echo ""
}

# Function to create development aliases
create_dev_aliases() {
    print_header "Creating Development Aliases"
    
    "$PROJECT_DIR/scripts/port-manager.sh" --aliases
    
    echo ""
}

# Function to test the setup
test_setup() {
    print_header "Testing Setup"
    
    # Test worktree manager
    print_info "Testing worktree manager..."
    if "$PROJECT_DIR/scripts/worktree-manager.sh" --help > /dev/null 2>&1; then
        print_success "Worktree manager working"
    else
        print_error "Worktree manager failed"
    fi
    
    # Test port manager
    print_info "Testing port manager..."
    if "$PROJECT_DIR/scripts/port-manager.sh" --help > /dev/null 2>&1; then
        print_success "Port manager working"
    else
        print_error "Port manager failed"
    fi
    
    # Test git worktree support
    print_info "Testing git worktree support..."
    if git -C "$PROJECT_DIR" worktree list > /dev/null 2>&1; then
        print_success "Git worktree support available"
    else
        print_error "Git worktree support not available"
    fi
    
    echo ""
}

# Function to show usage examples
show_usage_examples() {
    print_header "Usage Examples"
    
    echo "🎯 Basic Workflow:"
    echo "  1. Create a new worktree:     wt new-feature"
    echo "  2. VS Code opens automatically in new worktree"
    echo "  3. Start Claude Code:         claude"
    echo "  4. Run dev server:            npm run dev:docker"
    echo ""
    
    echo "📊 Port Management:"
    echo "  • Check port usage:          ports --show"
    echo "  • Suggest port for worktree: ports --suggest feature-name"
    echo "  • Kill process on port:      ports --kill 3001"
    echo ""
    
    echo "🔧 Worktree Management:"
    echo "  • List all worktrees:        wt --list"
    echo "  • Clean up merged branches:  wt --clean"
    echo "  • Help:                      wt --help"
    echo ""
    
    echo "💡 Pro Tips:"
    echo "  • Use different desktop spaces for each worktree"
    echo "  • Docker dev runs on port 3001 (configured in docker-compose.dev.yml)"
    echo "  • Each worktree gets its own .env and .claude settings"
    echo "  • Use npm run dev:docker:restart for safe database restarts"
    echo ""
}

# Function to show next steps
show_next_steps() {
    print_header "Next Steps"
    
    echo "🚀 You're ready to start multitasking with Claude Code!"
    echo ""
    echo "Try creating your first worktree:"
    echo "  wt saas-development"
    echo ""
    echo "This will:"
    echo "  ✅ Create a new branch and worktree"
    echo "  ✅ Copy all configuration files"
    echo "  ✅ Open VS Code in the new worktree"
    echo "  ✅ Set up branch description"
    echo ""
    echo "Then in the new VS Code window:"
    echo "  1. Open terminal"
    echo "  2. Run: claude"
    echo "  3. Start working on your feature!"
    echo ""
    echo "📖 For more details, see:"
    echo "  • scripts/WORKTREE_README.md"
    echo "  • wt --help"
    echo "  • ports --help"
    echo ""
}

# Main execution
main() {
    clear
    
    print_header "Claude Code Multitasking Setup"
    echo "Based on the YouTube video workflow"
    echo ""
    
    check_prerequisites
    setup_aliases
    create_dev_aliases
    test_setup
    show_usage_examples
    show_next_steps
    
    print_success "Setup complete! 🎉"
    print_info "Restart your terminal or run: source ~/.zshrc"
}

# Run main function
main