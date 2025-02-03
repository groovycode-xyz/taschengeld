# Coding Standards

This document outlines the coding standards and best practices for the Taschengeld project.

## General Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Keep lines under 100 characters
- Use meaningful variable and function names
- Write self-documenting code
- Follow DRY (Don't Repeat Yourself) principles

### File Organization

- One component/class per file
- Group related files in directories
- Use index files for clean exports
- Keep files focused and small

## TypeScript Guidelines

### Type Safety

```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  role: 'admin' | 'parent' | 'child';
}

// ❌ Bad
interface User {
  id: any;
  name: any;
  role: string;
}
```

### Type Inference

```typescript
// ✅ Good
const numbers = [1, 2, 3].map((n) => n * 2);

// ❌ Bad
const numbers: number[] = [1, 2, 3].map((n: number): number => n * 2);
```

### Null Handling

```typescript
// ✅ Good
function getUserName(user: User | null): string {
  return user?.name ?? 'Anonymous';
}

// ❌ Bad
function getUserName(user: User | null): string {
  return user ? user.name : 'Anonymous';
}
```

## React Guidelines

### Component Structure

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary'
}) => (
  <button
    onClick={onClick}
    className={`btn btn-${variant}`}
  >
    {label}
  </button>
);

// ❌ Bad
const Button = (props) => (
  <button onClick={props.onClick} className="btn">
    {props.label}
  </button>
);
```

### Hooks Usage

```typescript
// ✅ Good
const useTaskStatus = (taskId: string) => {
  const [status, setStatus] = useState<'pending' | 'complete'>('pending');

  useEffect(() => {
    // Effect cleanup
    return () => {
      // Cleanup code
    };
  }, [taskId]);

  return status;
};

// ❌ Bad
const useTaskStatus = (taskId) => {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // No cleanup
  });

  return status;
};
```

### State Management

```typescript
// ✅ Good
const [tasks, setTasks] = useState<Task[]>([]);
setTasks((prev) => [...prev, newTask]);

// ❌ Bad
const [tasks, setTasks] = useState([]);
tasks.push(newTask); // Mutating state directly
setTasks(tasks);
```

## API Guidelines

### Error Handling

```typescript
// ✅ Good
try {
  const response = await api.get('/tasks');
  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    logger.error('API Error:', error.message);
    throw new CustomError('Failed to fetch tasks');
  }
  throw error;
}

// ❌ Bad
try {
  const response = await api.get('/tasks');
  return response.data;
} catch (error) {
  console.log(error);
  return null;
}
```

### API Requests

```typescript
// ✅ Good
const api = {
  async getTasks() {
    const response = await axios.get<Task[]>('/api/tasks');
    return response.data;
  },
};

// ❌ Bad
const getTasks = () => {
  return fetch('/api/tasks').then((res) => res.json());
};
```

## Database Guidelines

### Query Structure

```typescript
// ✅ Good
const getUserTasks = async (userId: number) => {
  const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
  return result.rows;
};

// ❌ Bad
const getUserTasks = async (userId) => {
  const result = await db.query(`SELECT * FROM tasks WHERE user_id = ${userId}`);
  return result.rows;
};
```

### Transaction Handling

```typescript
// ✅ Good
const transferMoney = async (from: number, to: number, amount: number) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, from]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, to]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// ❌ Bad
const transferMoney = async (from, to, amount) => {
  await db.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, from]);
  await db.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, to]);
};
```

## Testing Guidelines

### Unit Tests

```typescript
// ✅ Good
describe('TaskCard', () => {
  it('should display task title', () => {
    const task = { id: 1, title: 'Test Task' };
    const { getByText } = render(<TaskCard task={task} />);
    expect(getByText('Test Task')).toBeInTheDocument();
  });
});

// ❌ Bad
test('task card works', () => {
  const { container } = render(<TaskCard />);
  expect(container).toBeTruthy();
});
```

### Integration Tests

```typescript
// ✅ Good
describe('Task API', () => {
  it('should create a new task', async () => {
    const task = { title: 'New Task', value: 10 };
    const response = await request(app).post('/api/tasks').send(task);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(task);
  });
});

// ❌ Bad
test('api works', async () => {
  const response = await request(app).get('/api/tasks');
  expect(response.status).toBe(200);
});
```

## Documentation Guidelines

### Code Comments

```typescript
// ✅ Good
/**
 * Calculates the total balance for a user
 * @param userId - The user's ID
 * @returns The total balance in cents
 * @throws {UserNotFoundError} If user doesn't exist
 */
const calculateBalance = async (userId: number): Promise<number> => {
  // Implementation
};

// ❌ Bad
// Gets balance
const getBalance = (id) => {
  // Do stuff
};
```

### Component Documentation

````typescript
// ✅ Good
/**
 * TaskList component displays a paginated list of tasks
 *
 * @example
 * ```tsx
 * <TaskList
 *   tasks={tasks}
 *   onTaskComplete={handleComplete}
 *   pageSize={10}
 * />
 * ```
 */
interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: number) => void;
  pageSize?: number;
}

// ❌ Bad
// Task list component
const TaskList = (props) => {
  // Implementation
};
````

## Git Guidelines

### Commit Messages

```
✅ Good:
feat: add task completion notification
fix: prevent duplicate task submissions
docs: update API authentication guide

❌ Bad:
updated code
fix bug
wip
```

### Branch Naming

```
✅ Good:
feature/task-notifications
bugfix/duplicate-submissions
docs/api-auth-guide

❌ Bad:
new-feature
fix
update
```

## Additional Resources

1. [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
2. [React Patterns](https://reactpatterns.com/)
3. [Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)
4. [Git Commit Messages](https://www.conventionalcommits.org/)

Last Updated: December 4, 2024

```

```
