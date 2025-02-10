#!/bin/bash
echo "Cleaning up Docker resources..."

# Remove stopped containers, unused networks, dangling images, and build cache
docker system prune -f

# Only remove unused images if explicitly requested
if [ "$1" == "--all" ]; then
    docker system prune -af
fi

# Report disk space
echo "Current Docker disk usage:"
docker system df
