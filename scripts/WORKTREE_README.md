# Git Worktree Manager for Taschengeld

This system allows you to work on multiple branches simultaneously in separate VS Code windows, exactly like you saw in the YouTube video.

## Quick Setup

1. **Activate the alias** (run this in your terminal):
   ```bash
   source scripts/setup-worktree-alias.sh
   ```

2. **Create your first worktree**:
   ```bash
   wt feature/saas-development
   ```

3. **VS Code will automatically open** in the new worktree directory!

## How It Works

### Directory Structure
```
/Users/jamespace/Projects/
├── taschengeld/                    # Main project (current)
├── taschengeld-feature-saas-development/   # SaaS worktree
├── taschengeld-feature-new-feature/        # Another feature worktree
└── taschengeld-hotfix-critical-fix/        # Hotfix worktree
```

### Each Worktree Is Independent
- ✅ **Separate VS Code windows** - no branch conflicts
- ✅ **Independent file changes** - edit different files simultaneously
- ✅ **Separate Docker environments** - run on different ports
- ✅ **Git awareness** - all worktrees share the same Git history
- ✅ **Automatic cleanup** - when branches are merged, worktrees can be cleaned up

## Usage Examples

### Create New Feature Branch
```bash
wt feature/saas-development
# Creates: taschengeld-feature-saas-development/
# Opens VS Code automatically
```

### Create Hotfix from Main
```bash
wt hotfix/critical-fix main
# Creates branch from main instead of development
```

### List All Worktrees
```bash
wt --list
```

### Clean Up Merged Branches
```bash
wt --clean
# Prompts to remove worktrees for merged branches
```

## Multi-LLM Workflow

### Perfect for Your Use Case:
1. **Main window**: Keep current VS Code open for main branch work
2. **SaaS window**: Run `wt feature/saas-development` to open separate VS Code
3. **Each LLM session**: Works in its own VS Code window with its own branch
4. **No conflicts**: Branch changes in one window don't affect the other

### Example Session:
```bash
# Terminal 1 (Current Claude session)
cd /Users/jamespace/Projects/taschengeld
# Work on main branch or create new worktree

# Terminal 2 (SaaS Claude session)
wt feature/saas-development
# Now in separate directory with separate VS Code window
```

## Benefits

### ✅ Solves Your Problems:
- No more branch switching conflicts between LLM sessions
- Each VS Code window shows the correct branch
- Independent Docker environments
- Clean separation of concerns

### ✅ Git Integration:
- All worktrees share the same Git repository
- Branches are visible across all worktrees
- Merges work normally
- Remote pushes/pulls work from any worktree

### ✅ Automatic Management:
- VS Code opens automatically
- Branch descriptions are set
- Cleanup tools for merged branches
- Status monitoring

## Docker Considerations

### Port Management
Each worktree can run Docker independently:
```bash
# Main project
npm run dev:docker      # Port 3001 (configured in docker-compose.dev.yml)

# SaaS worktree
npm run dev:docker      # Runs on same port 3001 but in isolated container
```

**Note**: Docker development uses port 3001 by default. Each worktree runs in its own isolated Docker environment, so you can run multiple worktrees simultaneously without port conflicts.

### Environment Variables
Each worktree has its own `.env` file, so you can:
- Use different database configurations
- Test different environment settings
- Run isolated development environments

## Tips for Success

### 1. Branch Naming
Use descriptive names that become clear directory names:
- `feature/saas-development` → `taschengeld-feature-saas-development`
- `hotfix/mode-persistence` → `taschengeld-hotfix-mode-persistence`

### 2. Communication Between LLMs
- Use BRANCHES.md to document what each branch does
- Set branch descriptions when creating worktrees
- Update documentation as you work

### 3. Cleanup Regularly
- Run `wt --clean` after merging branches
- Remove worktree directories when done
- Keep your Projects folder organized

### 4. Git Operations
- Commits, pushes, and pulls work normally in each worktree
- Merge operations should be done from the main project directory
- All worktrees see the same remote repository state

## Troubleshooting

### Alias Not Working
If `wt` command isn't found:
```bash
# Temporary fix
source scripts/setup-worktree-alias.sh

# Permanent fix
echo 'alias wt="/Users/jamespace/Projects/taschengeld/scripts/worktree-manager.sh"' >> ~/.zshrc
source ~/.zshrc
```

### VS Code Not Opening
Make sure VS Code is in your PATH:
```bash
# Test if 'code' command works
code --version

# If not, install VS Code command line tools
# Command Palette → Shell Command: Install 'code' command in PATH
```

### Docker Port Conflicts
If multiple worktrees try to use the same ports:
```bash
# Modify docker-compose.dev.yml in the worktree
# Change port mappings, e.g., 3002:3000 instead of 3001:3000
```

## Advanced Usage

### Custom Base Branch
```bash
wt feature/hotfix-branch main    # Create from main instead of development
```

### Existing Branch
```bash
wt existing-branch-name          # Checkout existing branch in new worktree
```

### Manual Directory Selection
The script automatically creates directories like `taschengeld-feature-name`, but you can modify the script to customize naming.

---

This system gives you exactly what you saw in the YouTube video - independent VS Code windows for each branch, perfect for multi-LLM development workflows!