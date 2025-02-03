# Contributing Guidelines

Thank you for your interest in contributing to Taschengeld! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Documentation](#documentation)
7. [Testing](#testing)
8. [Security](#security)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age
- Body size
- Disability
- Ethnicity
- Gender identity
- Experience level
- Nationality
- Personal appearance
- Race
- Religion
- Sexual identity/orientation

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

## Getting Started

### Prerequisites

1. Node.js 18+
2. Docker and Docker Compose
3. Git
4. PostgreSQL (for local development)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/tgeld.git
cd tgeld

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development environment
docker compose -f docker-compose.dev.yml up -d
```

### First Time Contributors

1. Look for issues labeled `good-first-issue`
2. Read the documentation
3. Join our community chat
4. Ask questions in discussions

## Development Process

### Branching Strategy

```
main
├── feature/task-management
├── bugfix/login-issue
└── docs/api-documentation
```

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test additions/changes
- `refactor/` - Code refactoring

### Commit Messages

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Test updates
- `chore`: Maintenance

Example:

```
feat(tasks): add task completion notification

- Add notification component
- Integrate with task completion flow
- Add notification preferences

Closes #123
```

## Pull Request Process

### Before Submitting

1. Update documentation
2. Add/update tests
3. Ensure CI passes
4. Update changelog
5. Rebase on main

### PR Template

```markdown
## Description

[Description of changes]

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested

## Checklist

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests passing
- [ ] Changelog updated
- [ ] PR is linked to issue
```

### Review Process

1. Automated checks must pass
2. One approval required
3. No blocking comments
4. All discussions resolved

## Coding Standards

### TypeScript

```typescript
// Follow interface naming convention
interface ITaskService {
  getTasks(): Promise<Task[]>;
  createTask(task: CreateTaskDto): Promise<Task>;
}

// Use type annotations
function calculateTotal(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

// Prefer interfaces over type aliases
interface User {
  id: number;
  name: string;
  role: UserRole;
}
```

### React Components

```typescript
// Use functional components
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete
}) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <button onClick={() => onComplete(task.id)}>
        Complete
      </button>
    </div>
  );
};

// Use hooks appropriately
const useTaskStatus = (taskId: string) => {
  const [status, setStatus] = useState<TaskStatus>('pending');

  useEffect(() => {
    // Effect implementation
    return () => {
      // Cleanup
    };
  }, [taskId]);

  return status;
};
```

## Documentation

### Code Documentation

```typescript
/**
 * Calculates the total balance for a user
 * @param userId - The user's ID
 * @param includeCompleted - Whether to include completed tasks
 * @returns The total balance in cents
 * @throws {UserNotFoundError} If user doesn't exist
 */
async function calculateBalance(userId: number, includeCompleted = false): Promise<number> {
  // Implementation
}
```

### API Documentation

```typescript
/**
 * @api {post} /tasks Create Task
 * @apiName CreateTask
 * @apiGroup Tasks
 * @apiVersion 1.0.0
 *
 * @apiParam {String} title Task title
 * @apiParam {Number} value Task value in cents
 * @apiParam {String} [description] Task description
 *
 * @apiSuccess {Object} task Created task
 * @apiSuccess {Number} task.id Task ID
 * @apiSuccess {String} task.title Task title
 * @apiSuccess {Number} task.value Task value
 */
```

## Testing

### Test Requirements

1. Unit tests for new code
2. Integration tests for API endpoints
3. E2E tests for critical paths
4. Maintain coverage thresholds

### Example Test

```typescript
describe('TaskService', () => {
  let service: TaskService;
  let mockRepo: MockType<Repository<Task>>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    service = new TaskService(mockRepo);
  });

  it('should create task', async () => {
    const task = {
      title: 'Test Task',
      value: 1000,
    };

    mockRepo.save.mockResolvedValue({
      id: 1,
      ...task,
    });

    const result = await service.createTask(task);
    expect(result).toMatchObject(task);
  });
});
```

## Security

### Security Checklist

1. No secrets in code
2. Input validation
3. Output encoding
4. Authentication checks
5. Authorization checks

### Reporting Security Issues

1. Do not create public issues
2. Email security@taschengeld.com
3. Include detailed description
4. Wait for response before disclosure

## Additional Resources

1. [Coding Standards](coding-standards.md)
2. [Testing Guide](testing.md)
3. [API Documentation](api-reference.md)
4. [Security Guidelines](../2-architecture/security.md)

Last Updated: December 4, 2024

```

```
