# Testing Guide

This document outlines the testing strategies, tools, and best practices for the Taschengeld project.

## Testing Stack

### Core Testing Tools

- Jest - Test runner and assertion library
- React Testing Library - Component testing
- Cypress - End-to-end testing
- MSW (Mock Service Worker) - API mocking
- Supertest - API integration testing

### Additional Tools

- jest-axe - Accessibility testing
- jest-coverage - Code coverage
- jest-snapshot - UI snapshot testing
- Faker.js - Test data generation

## Test Types

### Unit Tests

Unit tests verify individual components and functions in isolation.

```typescript
// Component Unit Test
describe('TaskCard', () => {
  it('renders task details correctly', () => {
    const task = {
      id: 1,
      title: 'Clean Room',
      value: 500,
      status: 'pending'
    };

    const { getByText, getByRole } = render(
      <TaskCard task={task} onComplete={jest.fn()} />
    );

    expect(getByText('Clean Room')).toBeInTheDocument();
    expect(getByText('5.00 €')).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent('Complete');
  });

  it('calls onComplete when button is clicked', () => {
    const onComplete = jest.fn();
    const task = { id: 1, title: 'Task', value: 100 };

    const { getByRole } = render(
      <TaskCard task={task} onComplete={onComplete} />
    );

    fireEvent.click(getByRole('button'));
    expect(onComplete).toHaveBeenCalledWith(1);
  });
});

// Utility Function Unit Test
describe('calculateTotalBalance', () => {
  it('sums up all transactions correctly', () => {
    const transactions = [
      { amount: 100, type: 'credit' },
      { amount: 50, type: 'debit' },
      { amount: 75, type: 'credit' }
    ];

    expect(calculateTotalBalance(transactions)).toBe(125);
  });
});
```

### Integration Tests

Integration tests verify that multiple components or systems work together.

```typescript
// API Integration Test
describe('Task API', () => {
  const testDb = new TestDatabase();

  beforeEach(async () => {
    await testDb.migrate();
    await testDb.seed();
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  it('creates and retrieves tasks', async () => {
    const newTask = {
      title: 'New Task',
      value: 1000,
      description: 'Test task'
    };

    // Create task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .set('Authorization', `Bearer ${testToken}`);

    expect(createResponse.status).toBe(201);
    const taskId = createResponse.body.id;

    // Retrieve task
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(newTask);
  });
});

// Component Integration Test
describe('TaskList with Filtering', () => {
  it('filters and displays tasks correctly', async () => {
    const tasks = [
      { id: 1, title: 'Task 1', status: 'pending' },
      { id: 2, title: 'Task 2', status: 'completed' }
    ];

    const { getByRole, getByText, queryByText } = render(
      <>
        <TaskFilter />
        <TaskList tasks={tasks} />
      </>
    );

    // Select completed filter
    fireEvent.click(getByRole('button', { name: 'Completed' }));

    // Check filtering
    expect(queryByText('Task 1')).not.toBeInTheDocument();
    expect(getByText('Task 2')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

E2E tests verify the entire application flow from user perspective.

```typescript
// Cypress E2E Test
describe('Task Management', () => {
  beforeEach(() => {
    cy.login('parent@example.com', 'password123');
  });

  it('completes full task lifecycle', () => {
    // Create new task
    cy.get('[data-testid="new-task-button"]').click();
    cy.get('[data-testid="task-title"]').type('Clean Garage');
    cy.get('[data-testid="task-value"]').type('10');
    cy.get('[data-testid="save-task"]').click();

    // Verify task creation
    cy.get('[data-testid="task-list"]').should('contain', 'Clean Garage').and('contain', '10.00 €');

    // Switch to child account
    cy.login('child@example.com', 'password123');

    // Complete task
    cy.get('[data-testid="complete-task"]').first().click();
    cy.get('[data-testid="confirmation-dialog"]')
      .should('be.visible')
      .find('button')
      .contains('Confirm')
      .click();

    // Verify completion
    cy.get('[data-testid="balance"]').should('contain', '10.00 €');
  });
});
```

### API Tests

Tests for API endpoints and their behavior.

```typescript
// API Endpoint Test
describe('POST /api/tasks', () => {
  it('validates required fields', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({})
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('title is required');
  });

  it('handles authentication', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'Test' });

    expect(response.status).toBe(401);
  });
});
```

## Test Organization

### Directory Structure

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── api/
│   └── features/
├── e2e/
│   └── specs/
└── fixtures/
    ├── tasks.json
    └── users.json
```

### Naming Conventions

```
✅ Good:
- user-registration.spec.ts
- task-completion.test.ts
- auth-flow.cy.ts

❌ Bad:
- test.ts
- spec.ts
- testing-file.ts
```

## Test Coverage

### Coverage Goals

- Unit Tests: 80%+ coverage
- Integration Tests: 70%+ coverage
- E2E Tests: Critical paths covered

### Running Coverage Reports

```bash
# Unit and Integration Tests
npm run test:coverage

# E2E Coverage
npm run cypress:coverage
```

## Mocking

### API Mocking with MSW

```typescript
// Handler Setup
const handlers = [
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: 1, title: 'Mock Task' }]));
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        title,
      })
    );
  }),
];

// Test Setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Component Mocking

```typescript
// Mock Component
jest.mock('../components/TaskCard', () => {
  return function MockTaskCard(props) {
    return <div data-testid="mock-task-card" {...props} />;
  };
});

// Mock Hook
jest.mock('../hooks/useTask', () => ({
  useTask: () => ({
    task: { id: 1, title: 'Mock Task' },
    isLoading: false,
    error: null
  })
}));
```

## Testing Best Practices

### Do's

1. Test behavior, not implementation
2. Use meaningful assertions
3. Keep tests independent
4. Clean up after tests
5. Use appropriate test doubles

### Don'ts

1. Don't test implementation details
2. Don't use snapshot tests for everything
3. Don't mock everything
4. Don't write brittle tests
5. Don't test third-party code

## Continuous Integration

### CI Pipeline

```yaml
test:
  script:
    - npm install
    - npm run lint
    - npm run test:unit
    - npm run test:integration
    - npm run test:e2e
  coverage:
    report:
      - coverage/lcov.info
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:staged"
    }
  }
}
```

## Additional Resources

1. [Jest Documentation](https://jestjs.io/docs/getting-started)
2. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
3. [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
4. [MSW Documentation](https://mswjs.io/docs/)

Last Updated: December 4, 2024

```

```
