# Contributing to Taschengeld

Thank you for your interest in contributing to Taschengeld! This document provides guidelines and best practices for contributing to this family allowance tracking application.

## 🚀 Quick Start

1. **Fork and clone** the repository
2. **Set up development environment**: `npm run dev:docker`
3. **Read project documentation**: `CLAUDE.md` and `BRANCHES.md`
4. **Create documented branch**: See [Branch Management](#branch-management)
5. **Make your changes** following our [coding standards](#coding-standards)
6. **Submit a pull request** following our [PR process](#pull-request-process)

## 📋 Branch Management

### Branch Documentation Requirements

**All branches must be documented immediately upon creation:**

```bash
# Create and document new branch
git checkout -b feature/my-awesome-feature
git config branch.feature/my-awesome-feature.description "Brief purpose description"

# Update central registry
# Edit BRANCHES.md to add your branch with:
# - Purpose and goals
# - Current progress
# - Testing requirements
# - Next steps
```

### Branch Naming Conventions

Use descriptive names with appropriate prefixes:

- `feature/` - New functionality (e.g., `feature/svg-icon-management`)
- `hotfix/` - Critical production fixes (e.g., `hotfix/docker-startup-loop`)
- `refactor/` - Code improvements without new features (e.g., `refactor/icon-system-centralization`)
- `docs/` - Documentation-only changes (e.g., `docs/api-documentation-update`)

### Branch Lifecycle

1. **Create** from `development` branch
2. **Document** in `BRANCHES.md` and Git descriptions
3. **Develop** with regular commits and testing
4. **Update** documentation as progress is made
5. **Submit** pull request when complete
6. **Clean up** after merge: `npm run branches:cleanup`

### Branch Management Tools

```bash
npm run branches              # Show branch status and progress
npm run branches:desc         # Display all branch descriptions
npm run branches:cleanup      # Clean up merged branches
npm run git:setup            # Install Git aliases for branch management
```

## 🛠️ Development Environment

### Prerequisites

- **Docker Desktop** with BuildKit enabled
- **Node.js 18+** (for local development)
- **Git** with proper configuration

### Setup

```bash
# Clone the repository
git clone https://github.com/groovycode-xyz/taschengeld.git
cd taschengeld

# Start development environment (recommended)
npm run dev:docker

# OR start locally (requires separate PostgreSQL)
npm install
npm run dev
```

### Environment Configuration

- **Development**: `npm run dev:docker` (port 3001)
- **Local**: `npm run dev` (port 3000)
- **Database**: PostgreSQL with alphanumeric passwords only

### Important Development Notes

⚠️ **Database Warning**: `npm run dev:docker:clean` DELETES ALL DATA! Use `npm run dev:docker:restart` for safe restarts.

## 📝 Coding Standards

### Code Quality

```bash
npm run check         # TypeScript + lint + format (run before committing)
npm run lint          # Prettier + Next.js linting
npm run format        # Prettier formatting only
```

### Code Style

- **Follow existing patterns** unless objectively superior
- **Maintain backward compatibility**
- **Keep solutions simple** (KISS principle)
- **Use TypeScript** with proper type definitions
- **No comments unless necessary** - code should be self-documenting

### Component Standards

- **Follow existing component structure** in `/components/`
- **Use shadcn/ui components** for consistency
- **Implement responsive design** (tablets 768px+, desktop 1024px+)
- **Include proper accessibility** attributes
- **Test in Docker environment** before submitting

### Icon System

- **Use centralized icon registry** (`app/lib/icons/icon-registry.ts`)
- **Follow icon categorization** (people, objects, activities, etc.)
- **Include search keywords** for discoverability
- **Test with IconSelector** component

## 📤 Pull Request Process

### Before Creating a PR

1. **Update documentation**:

   - Mark your branch as complete in `BRANCHES.md`
   - Update any relevant documentation
   - Include screenshots for UI changes

2. **Test thoroughly**:

   - Run `npm run check` (must pass)
   - Test in Docker environment
   - Verify responsive design on different screen sizes
   - Test both parent and child modes (if applicable)

3. **Clean commit history**:
   - Use conventional commit messages
   - Squash related commits if necessary
   - Remove any debugging commits

### PR Requirements

#### Title Format

```
feat: Add awesome new feature
fix: Resolve critical Docker startup issue
docs: Update API documentation
refactor: Improve icon system performance
```

#### Description Template

```markdown
## Summary

Brief description of what this PR does and why.

## Changes

- List of specific changes made
- Focus on the "what" not the "how"

## Testing

- [ ] All existing tests pass
- [ ] New functionality tested manually
- [ ] Tested in Docker environment
- [ ] UI changes tested on tablet/desktop
- [ ] Parent/child mode compatibility verified

## Screenshots

[Include screenshots for UI changes]

## Breaking Changes

[List any breaking changes or migration notes]

## Related Issues

Closes #123
```

### Review Process

1. **Automated checks** must pass (linting, TypeScript, etc.)
2. **Manual review** by project maintainers
3. **Testing verification** in development environment
4. **Documentation review** for completeness
5. **Approval and merge** to appropriate branch

## 🏗️ Architecture Guidelines

### Project Structure

- **App Router**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Radix primitives
- **State Management**: React Context API
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design system

### Key Patterns

- **Service Pattern**: Database operations in `/app/lib/services/`
- **API Routes**: RESTful endpoints in `/app/api/`
- **Context Providers**: Global state in `/components/context/`
- **Component Organization**: Feature-based with shared UI components

### Design Principles

- **Family-friendly**: Designed for kiosk-style home use
- **Device optimization**: Tablets and desktop only (768px+)
- **Security model**: PIN-based mode switching, not enterprise auth
- **Docker-first**: Development should mirror production

## 🧪 Testing Guidelines

### Manual Testing Approach

This project uses **manual testing** as the primary quality assurance method:

- **Docker environment testing** (mirrors production)
- **Multi-device testing** (tablet and desktop viewports)
- **User flow testing** (parent/child mode scenarios)
- **Data persistence testing** (backup/restore functionality)

### Testing Checklist

- [ ] **Functionality**: All features work as expected
- [ ] **Responsive Design**: Proper layout on tablets (768px+) and desktop (1024px+)
- [ ] **Mode Switching**: Parent/child mode transitions work correctly
- [ ] **Data Integrity**: Database operations complete successfully
- [ ] **Performance**: Reasonable load times and responsiveness
- [ ] **Accessibility**: Keyboard navigation and screen reader compatibility

## 🔒 Security Considerations

### Family-Friendly Security Model

- **PIN-based access control** (not enterprise authentication)
- **Plain text PIN storage** (appropriate for family context)
- **UI-based restrictions** (not API-level authorization)
- **Trust-based model** (designed for home network use)

### Development Security

- **No secrets in code** or commit history
- **Environment variables** for sensitive configuration
- **Docker environment isolation**
- **Regular dependency updates**

## 📚 Documentation Standards

### Code Documentation

- **Self-documenting code** preferred over comments
- **Type definitions** for all TypeScript interfaces
- **API endpoint documentation** in relevant files
- **Component prop interfaces** with clear descriptions

### Project Documentation

- **README.md**: Project overview and quick start
- **CLAUDE.md**: Comprehensive development guide for AI assistants
- **BRANCHES.md**: Active branch tracking and progress
- **Architecture docs**: In `/docs/` directory for complex systems

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Environment details** (Docker vs local, browser, device)
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots or videos** if applicable
- **Console errors** or relevant log output

### Feature Requests

For new features, please provide:

- **Use case description** and user story
- **Design considerations** for family-friendly interface
- **Device compatibility** requirements
- **Potential implementation approach**

## 🎯 Project Goals and Vision

### Core Values

- **Family-first design**: Easy for children and parents to use
- **Privacy-focused**: No external data collection or accounts
- **Reliable operation**: Stable Docker deployment
- **Maintainable code**: Clean, documented, professional standards

### Current Focus Areas

1. **SVG Icon Management**: Development tool for icon curation
2. **Enhanced Access Control**: Multi-device family policies
3. **Performance Optimization**: Faster load times and responsiveness
4. **Documentation**: Comprehensive guides for users and developers

## 🤝 Community Guidelines

### Communication

- **Be respectful** and constructive in all interactions
- **Ask questions** if anything is unclear
- **Share knowledge** and help other contributors
- **Follow GitHub community guidelines**

### Collaboration

- **Coordinate on major changes** through issues or discussions
- **Review others' pull requests** when possible
- **Share feedback** on design decisions and implementation
- **Maintain professional standards** in all contributions

---

## 📞 Getting Help

- **GitHub Issues**: For bugs, features, and general questions
- **CLAUDE.md**: Comprehensive development guide
- **Branch Documentation**: Check `BRANCHES.md` for current project context

## 📄 License

By contributing to Taschengeld, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Taschengeld!** 🎉

Your contributions help make family allowance management easier and more enjoyable for families around the world.
