# Frontend Architecture

This document outlines the frontend architecture, components, and design patterns used in Taschengeld.

## Technology Stack

### Core Technologies

- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS
- SWR for data fetching

### Build Tools

- Webpack
- PostCSS
- ESLint
- Prettier

## Project Structure

```
src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── features/
│   └── pages/
├── hooks/
├── lib/
├── pages/
├── styles/
├── types/
└── utils/
```

## Component Architecture

### Component Categories

1. **Page Components**

   - Complete pages
   - Route-level components
   - Data fetching logic

2. **Feature Components**

   - Task management
   - Piggybank interface
   - User management

3. **Common Components**

   - Buttons
   - Forms
   - Cards
   - Modals

4. **Layout Components**
   - Navigation
   - Sidebar
   - Footer
   - Container

## State Management

### Client State

- React Context for global UI state
- SWR for server state
- Local component state
- Form state with React Hook Form

### Server State

- SWR for caching and revalidation
- Optimistic updates
- Error boundaries
- Loading states

## Routing

### Page Structure

```
pages/
├── index.tsx
├── dashboard/
├── tasks/
├── piggybank/
└── settings/
```

### Route Guards

- Authentication check
- Role-based access
- Redirect logic

## Data Fetching

### SWR Configuration

```typescript
const config = {
  fetcher: (url: string) => fetch(url).then((r) => r.json()),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};
```

### Custom Hooks

```typescript
const useTask = (taskId: string) => {
  const { data, error } = useSWR(`/api/tasks/${taskId}`);
  return {
    task: data,
    isLoading: !error && !data,
    isError: error,
  };
};
```

## Styling

### Tailwind Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  },
  plugins: []
};
```

### Component Styling

```typescript
const Button = styled.button`
  ${tw`bg-primary-500 text-white px-4 py-2 rounded`}
`;
```

## Performance

### Optimization Techniques

1. Code splitting
2. Image optimization
3. Bundle size analysis
4. Lazy loading
5. Memoization

### Monitoring

- Core Web Vitals
- Lighthouse scores
- Error tracking
- Performance metrics

## Testing

### Testing Stack

- Jest
- React Testing Library
- Cypress
- MSW for API mocking

### Test Categories

1. Unit tests
2. Integration tests
3. E2E tests
4. Visual regression tests

## Accessibility

### Standards

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA attributes
- Keyboard navigation

### Implementation

```typescript
const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="focus:ring-2"
    role="button"
    tabIndex={0}
  >
    {children}
  </button>
);
```

## Error Handling

### Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Error States

- Loading states
- Error messages
- Retry mechanisms
- Fallback UI

## Internationalization

### i18n Setup

```typescript
const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de'],
  loadLocaleFrom: (locale, namespace) => import(`./locales/${locale}/${namespace}.json`),
};
```

### Usage

```typescript
const { t } = useTranslation();
return <h1>{t('welcome.title')}</h1>;
```

## Security

### Frontend Security

1. XSS prevention
2. CSRF protection
3. Content Security Policy
4. Secure data handling

### Authentication Flow

```typescript
const useAuth = () => {
  const { data: session } = useSWR('/api/auth/session');
  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
  };
};
```

## Development Workflow

### Code Standards

1. TypeScript strict mode
2. ESLint rules
3. Prettier config
4. Git hooks

### CI/CD Pipeline

1. Lint checking
2. Type checking
3. Unit tests
4. Build verification
5. Deployment

## Component Examples

### Task Card Component

```typescript
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <div className="mt-4">
        <Button onClick={() => onComplete(task.id)}>
          Complete Task
        </Button>
      </div>
    </div>
  );
};
```

## Additional Resources

1. [Component Library](../3-development/components.md)
2. [Style Guide](../3-development/style-guide.md)
3. [Testing Guide](../3-development/testing.md)
4. [Performance Guide](../3-development/performance.md)

Last Updated: December 4, 2024
