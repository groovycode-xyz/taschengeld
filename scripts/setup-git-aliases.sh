#!/bin/bash

# Setup Git aliases for branch documentation

echo "Setting up Git aliases for branch documentation..."

# Branch description aliases
git config alias.describe '!f() { git config branch.${1:-$(git branch --show-current)}.description "${2}"; }; f'
git config alias.desc-show '!f() { git config branch.${1:-$(git branch --show-current)}.description; }; f'
git config alias.branches-desc '!git for-each-ref --format="%(refname:short)|%(contents)" refs/heads/ | column -t -s "|"'

# Branch management aliases  
git config alias.new-branch '!f() { git checkout -b "$1" && git config branch."$1".description "$2" && echo "Created branch $1: $2"; }; f'
git config alias.branch-status '!f() { echo "Branch: $(git branch --show-current)"; echo "Description: $(git config branch.$(git branch --show-current).description)"; echo "Status:"; git status --short; }; f'
git config alias.cleanup-merged '!git branch --merged development | grep -v "development\|main\|*" | xargs -n 1 git branch -d'

# Pretty branch listing
git config alias.branches '!git branch -vv'
git config alias.recent-branches '!git for-each-ref --count=10 --sort=-committerdate refs/heads/ --format="%(refname:short) (%(committerdate:relative))"'

echo "✅ Git aliases configured!"
echo
echo "Available aliases:"
echo "  git describe <branch> <description>  - Set branch description"
echo "  git desc-show [branch]              - Show branch description"  
echo "  git branches-desc                   - Show all branches with descriptions"
echo "  git new-branch <name> <description> - Create documented branch"
echo "  git branch-status                   - Show current branch info"
echo "  git cleanup-merged                  - Delete branches merged to development"
echo "  git branches                        - Pretty branch listing"
echo "  git recent-branches                 - Show 10 most recent branches"
echo
echo "Examples:"
echo "  git describe feature/my-branch 'This branch adds awesome feature'"
echo "  git new-branch feature/cool-thing 'Adds cool new functionality'"
echo "  git desc-show"