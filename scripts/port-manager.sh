#!/bin/bash

# Port Manager for Worktree Development
# Helps manage different development servers on different ports

# Configuration
BASE_PORT=3000
MAIN_PROJECT_DIR="/Users/jamespace/Projects/taschengeld"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to get next available port
get_next_port() {
    local port=$BASE_PORT
    while lsof -i :$port >/dev/null 2>&1; do
        ((port++))
    done
    echo $port
}

# Function to show port usage
show_port_usage() {
    print_info "Current port usage:"
    echo ""
    
    # Check main project
    if lsof -i :3000 >/dev/null 2>&1; then
        print_success "Port 3000: Main project (taschengeld)"
    else
        echo "Port 3000: Available"
    fi
    
    # Check common worktree ports
    for port in {3001..3010}; do
        if lsof -i :$port >/dev/null 2>&1; then
            # Try to identify which worktree
            process_info=$(lsof -i :$port -t | head -1)
            if [[ -n "$process_info" ]]; then
                print_warning "Port $port: In use (PID: $process_info)"
            else
                print_warning "Port $port: In use"
            fi
        fi
    done
}

# Function to suggest port for worktree
suggest_port() {
    local worktree_name="$1"
    local suggested_port=$(get_next_port)
    
    print_info "Suggested port for '$worktree_name': $suggested_port"
    
    # Create a helper alias suggestion for Next.js/Docker
    local alias_name="dev-${worktree_name//-/}"
    echo ""
    print_info "Add this alias to your ~/.zshrc for easy server startup:"
    echo "alias $alias_name='cd $MAIN_PROJECT_DIR-worktrees/$worktree_name && npm run dev:docker'"
    echo ""
    
    # For Next.js projects
    if [[ -f "$MAIN_PROJECT_DIR/next.config.js" ]] || [[ -f "$MAIN_PROJECT_DIR/package.json" ]]; then
        print_info "For Next.js development (port configured in docker-compose.dev.yml):"
        echo "npm run dev:docker      # Docker development (recommended)"
        echo "npm run dev             # Local development"
    fi
}

# Function to kill processes on specific port
kill_port() {
    local port="$1"
    if [[ -z "$port" ]]; then
        print_error "Port number required"
        return 1
    fi
    
    if lsof -i :$port >/dev/null 2>&1; then
        print_info "Killing processes on port $port..."
        lsof -ti :$port | xargs kill -9
        print_success "Processes on port $port killed"
    else
        print_info "No processes running on port $port"
    fi
}

# Function to create development aliases
create_dev_aliases() {
    print_info "Creating development server aliases..."
    
    local aliases_file="$MAIN_PROJECT_DIR/scripts/dev-aliases.sh"
    
    cat > "$aliases_file" << 'EOF'
#!/bin/bash

# Development Server Aliases for Taschengeld Worktrees
# Source this file or add to your ~/.zshrc

# Main project
alias dev-main='cd /Users/jamespace/Projects/taschengeld && npm run dev:docker'

# Worktree development helpers
alias dev-restart='npm run dev:docker:restart'
alias dev-stop='npm run dev:docker:stop'
alias dev-clean='npm run dev:docker:clean'

# Port management helpers
alias ports='lsof -i :3000-3010'
alias kill-port='function _kill_port() { lsof -ti :$1 | xargs kill -9; }; _kill_port'

# Quick port check
alias check-port='function _check_port() { lsof -i :$1; }; _check_port'

# Docker helpers
alias docker-logs='docker compose -f docker-compose.dev.yml logs -f'
alias docker-ps='docker compose -f docker-compose.dev.yml ps'

EOF

    chmod +x "$aliases_file"
    print_success "Created development aliases at $aliases_file"
    print_info "Source this file or add to your ~/.zshrc:"
    echo "source $aliases_file"
}

# Main script logic
case "${1:-}" in
    --help|-h)
        echo "Port Manager for Worktree Development"
        echo ""
        echo "Usage:"
        echo "  port-manager --show              Show current port usage"
        echo "  port-manager --suggest [name]    Suggest port for worktree"
        echo "  port-manager --kill [port]       Kill processes on specific port"
        echo "  port-manager --aliases           Create development aliases"
        echo "  port-manager --help              Show this help"
        echo ""
        ;;
    --show|-s)
        show_port_usage
        ;;
    --suggest)
        suggest_port "${2:-worktree}"
        ;;
    --kill|-k)
        kill_port "$2"
        ;;
    --aliases|-a)
        create_dev_aliases
        ;;
    "")
        print_info "Port Manager - Quick Status"
        show_port_usage
        echo ""
        echo "Use --help for more options"
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac