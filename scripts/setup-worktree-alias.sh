#!/bin/bash

# Setup script for worktree alias
# Run this with: source scripts/setup-worktree-alias.sh

# Create the alias
alias wt="/Users/jamespace/Projects/taschengeld/scripts/worktree-manager.sh"

echo "✅ Worktree alias 'wt' is now active in this terminal session"
echo ""
echo "Usage examples:"
echo "  wt feature/saas-development    # Create SaaS development worktree"
echo "  wt feature/new-feature         # Create new feature worktree"
echo "  wt --list                      # List all worktrees"
echo "  wt --help                      # Show help"
echo ""
echo "To make this permanent, add this line to your ~/.zshrc:"
echo "alias wt=\"/Users/jamespace/Projects/taschengeld/scripts/worktree-manager.sh\""