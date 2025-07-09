#!/bin/bash

# Simple test script to demonstrate the new worktree functionality

echo "🧪 Testing Worktree Manager"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📋 Current worktrees:"
./scripts/worktree-manager.sh --list

echo ""
echo "🔧 Testing simple branch naming (like the YouTube video):"
echo "  Instead of: wt feature/saas-development"
echo "  Now use:    wt saas-development"

echo ""
echo "📁 Directory structure will be:"
echo "  /Users/jamespace/Projects/taschengeld-worktrees/saas-development/"

echo ""
echo "✅ Key improvements from the video:"
echo "  • Simpler branch naming (no feature/ prefix needed)"
echo "  • Matches video's directory structure"
echo "  • Copies specific hidden folders (.claude, .cursor, .vscode)"
echo "  • Opens VS Code with & for background execution"
echo "  • Cleaner error handling"

echo ""
echo "🚀 Ready to test? Run:"
echo "  wt saas-development"