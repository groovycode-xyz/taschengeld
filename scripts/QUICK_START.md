# Quick Start: Claude Code Multitasking

## 🚀 One-Time Setup

Run the setup script:
```bash
./scripts/setup-multitasking.sh
```

Then restart your terminal or run:
```bash
source ~/.zshrc
```

## 💡 Basic Usage

### Create a new worktree:
```bash
wt saas-development
```

This will:
- ✅ Create a new Git branch and worktree
- ✅ Copy `.env`, `.claude`, and other config files
- ✅ Open VS Code in the new worktree directory
- ✅ Prompt for a branch description

### Start working:
1. **In the new VS Code window** that opened:
2. Open terminal
3. Run: `claude`
4. Start your development server: `npm run dev:docker`

## 🔧 Essential Commands

| Command | Description |
|---------|-------------|
| `wt branch-name` | Create new worktree |
| `wt --list` | List all worktrees |
| `wt --clean` | Clean up merged branches |
| `ports --show` | Check port usage |
| `ports --kill 3001` | Kill process on port |

## 🏗️ Multi-LLM Workflow

### Perfect for your use case:
1. **Terminal 1**: Keep current session on main branch
2. **Terminal 2**: Run `wt saas-development` 
3. **Result**: Two independent VS Code windows
   - Main window: `main` branch
   - SaaS window: `saas-development` branch
4. **Each LLM session**: Works in its own window with no conflicts

## 📁 Directory Structure

```
/Users/jamespace/Projects/
├── taschengeld/                    # Main project
└── taschengeld-worktrees/          # Created automatically
    ├── saas-development/           # SaaS worktree
    └── other-feature/              # Other worktree
```

## 🐳 Docker Development

Each worktree runs Docker independently:
- Same port (3001) but isolated containers
- Separate databases
- Independent environment variables
- No conflicts between worktrees

## 🎯 Pro Tips

- Use different macOS desktop spaces for each worktree
- Each worktree gets its own `.claude` settings and permissions
- Use `npm run dev:docker:restart` for safe database restarts
- Update `BRANCHES.md` to document your work
- Set branch descriptions when creating worktrees

## 📚 More Information

- Full documentation: `scripts/WORKTREE_README.md`
- Help: `wt --help` or `ports --help`
- YouTube video: The workflow is based on best practices from the Claude Code multitasking video

---

**You're ready to multitask with Claude Code!** 🎉