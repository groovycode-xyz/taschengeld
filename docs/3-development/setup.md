# Development Setup Guide

This guide covers setting up your development environment for contributing to Taschengeld.

## Development Stack

- **Frontend**: Next.js 14, React 18, TypeScript 5
- **Backend**: Node.js 18, PostgreSQL 14
- **Testing**: Jest, React Testing Library
- **Tooling**: ESLint, Prettier, Husky

## Local Development Setup

### Prerequisites

1. **Required Software**

   - Node.js 18+
   - npm or yarn
   - Docker and Docker Compose
   - Git
   - VS Code (recommended)

2. **Recommended VS Code Extensions**
   - ESLint
   - Prettier
   - Docker
   - GitLens
   - TypeScript + JavaScript

### Initial Setup

1. **Clone and Install**

```bash
# Clone repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Install dependencies
npm install

# Install git hooks
npm run prepare
```

2. **Environment Setup**

```bash
# Copy environment file
cp .env.example .env.local

# Copy VS Code settings
cp .vscode/settings.example.json .vscode/settings.json
```

3. **Database Setup**

```bash
# Start database
docker compose -f docker-compose.dev.yml up -d db

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

### Development Workflow

1. **Start Development Server**

```bash
npm run dev
```

2. **Run Tests**

```bash
# Run all tests
npm test

# Run with watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage
```

3. **Code Quality**

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
tgeld/
├── app/                 # Next.js app directory
├── components/         # React components
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Next.js pages
├── public/            # Static assets
├── styles/            # Global styles
├── types/             # TypeScript types
└── __tests__/         # Test files
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages

### Testing

1. **Unit Tests**

   - Test individual components
   - Test utility functions
   - Mock external dependencies

2. **Integration Tests**

   - Test component interactions
   - Test API endpoints
   - Test database operations

3. **E2E Tests**
   - Test critical user flows
   - Test authentication
   - Test data persistence

### Git Workflow

1. **Branches**

   - `main`: Production-ready code
   - `develop`: Development branch
   - `feature/*`: New features
   - `fix/*`: Bug fixes
   - `docs/*`: Documentation updates

2. **Commits**

   - Use conventional commits
   - Include ticket numbers
   - Keep commits focused

3. **Pull Requests**
   - Create from feature branch to develop
   - Include tests
   - Update documentation
   - Add meaningful description

## Database Development

### Local Database

1. **Access PostgreSQL**

```bash
docker compose exec db psql -U postgres -d tgeld
```

2. **Reset Database**

```bash
npm run db:reset
```

### Migrations

1. **Create Migration**

```bash
npm run db:migration:create name_of_migration
```

2. **Run Migrations**

```bash
npm run db:migrate
```

3. **Rollback Migration**

```bash
npm run db:rollback
```

## Debugging

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next.js",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### Browser DevTools

- Use React Developer Tools
- Use Redux DevTools (if implemented)
- Check Network tab for API calls
- Monitor Console for errors

## Common Development Tasks

1. **Adding a New Feature**

   - Create feature branch
   - Implement changes
   - Add tests
   - Update documentation
   - Create pull request

2. **Fixing Bugs**

   - Create fix branch
   - Reproduce issue
   - Implement fix
   - Add regression tests
   - Create pull request

3. **Updating Dependencies**
   - Check for updates: `npm outdated`
   - Update packages: `npm update`
   - Test thoroughly
   - Update documentation

## Getting Help

- Check existing [documentation](../README.md)
- Search [GitHub Issues](https://github.com/yourusername/tgeld/issues)
- Join developer discussions
- Review pull requests

## Next Steps

1. [Coding Standards](coding-standards.md)
2. [Testing Guide](testing.md)
3. [Contributing Guidelines](contributing.md)

Last Updated: December 4, 2024
