#!/bin/zsh

# Function to display usage
show_usage() {
    echo "Usage: ./switch-mode.sh [local|docker]"
    echo "  local  - Switch to local development mode (npm run dev)"
    echo "  docker - Switch to Docker mode (docker compose)"
    exit 1
}

# Check if argument is provided
if [ $# -ne 1 ]; then
    show_usage
fi

# Get the mode from argument
MODE=$1

# Backup current .env if it exists
if [ -f .env ]; then
    echo "Backing up current .env..."
    mv .env .env.previous
fi

# Switch based on mode
case $MODE in
    "local")
        echo "Switching to local development mode..."
        cp .env.local .env
        echo "Ready for: npm run dev"
        ;;
    "docker")
        echo "Switching to Docker mode..."
        cp .env.docker .env
        echo "Ready for: docker compose up -d"
        ;;
    *)
        echo "Error: Invalid mode '$MODE'"
        show_usage
        ;;
esac

echo "Done! Mode switched to: $MODE" 