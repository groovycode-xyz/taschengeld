# Test: Claude Worktree Workflow

## Scenario Testing

### Test 1: User Requests New Feature

**User says**: "I want to add a dark mode feature"

**Expected Claude Response**:

1. Run: `wt dark-mode`
2. Explain: "I've created a new worktree for 'dark-mode' and VS Code will open"
3. Guide: "Start a new Claude session in the new window to continue"

### Test 2: User Requests Bug Fix

**User says**: "Let's fix the login issue on a new branch"

**Expected Claude Response**:

1. Run: `wt login-fix`
2. Explain what happened
3. Guide user to continue in new VS Code window

### Test 3: User Requests General Branch

**User says**: "Help me work on the API improvements"

**Expected Claude Response**:

1. Run: `wt api-improvements`
2. Standard workflow explanation

## What Claude Should NOT Do

❌ **Don't run**: `git checkout -b feature/dark-mode`
❌ **Don't run**: `git branch new-feature`
❌ **Don't use**: Regular git branching commands

## Verification Points

✅ Claude reads the worktree instructions in CLAUDE.md
✅ Claude automatically uses `wt` command instead of `git checkout -b`
✅ Claude explains the worktree workflow to the user
✅ Claude guides user to continue in new VS Code window
✅ Claude understands the multi-session workflow

## Testing the Setup

1. **Start Claude in main project**
2. **Say**: "I want to add a search feature"
3. **Verify**: Claude runs `wt search-feature`
4. **Verify**: VS Code opens in worktree directory
5. **Start new Claude session in new window**
6. **Say**: "We're working on the search-feature branch. I need to implement..."
7. **Verify**: New Claude session understands the context

## Success Criteria

- ✅ Claude automatically uses worktrees for new features
- ✅ No manual intervention needed from user
- ✅ Seamless workflow between main and worktree sessions
- ✅ Each Claude session works independently
- ✅ No branch conflicts or confusion

This test verifies that the CLAUDE.md instructions successfully guide Claude to use the worktree workflow automatically.
