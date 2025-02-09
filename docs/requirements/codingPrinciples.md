**Coding Principles and Rules**

# Coding Principles and Rules

Adhering to consistent coding standards ensures code quality, maintainability, and readability. This document outlines the coding principles and rules for the BudgetMaster project.

## General Principles

1. **Clean Code:**

   - Write readable, understandable, and maintainable code.
   - Use meaningful variable and function names.

2. **DRY (Don't Repeat Yourself):**

   - Avoid code duplication by abstracting reusable components and functions.

3. **KISS (Keep It Simple, Stupid):**

   - Opt for simple solutions over complex ones.
   - Avoid over-engineering.

4. **YAGNI (You Aren't Gonna Need It):**

   - Implement features only when necessary.

5. **Modularity:**

   - Break down the codebase into small, reusable modules.

6. **Single Responsibility Principle:**

   - Each module or function should have one responsibility.

7. **Formatting:**

   - Use consistent indentation (e.g., 2 spaces).
   - Maintain consistent brace style.
   - Limit line length to 80 characters.

## Language-Specific Guidelines

### **JavaScript/TypeScript (Frontend and Backend)**

1. **Syntax and Formatting:**

   - Use [Prettier](https://prettier.io/) for consistent code formatting with the following configuration:
     ```json
     {
       "singleQuote": true,
       "trailingComma": "es5",
       "tabWidth": 2,
       "semi": true,
       "printWidth": 100
     }
     ```
   - Adhere to [ESLint](https://eslint.org/) rules for code quality.
   - Use single quotes (') for string literals instead of double quotes (").

2. **Naming Conventions:**

   - Use `camelCase` for variables and functions.
   - Use `PascalCase` for React components and classes.
   - Use `UPPER_SNAKE_CASE` for constants.
   - Use meaningful variable and function names.

3. **File Structure and Naming:**

   - Organize files by feature or functionality.
   - Separate concerns (e.g., components, services, utilities).
   - Use kebab-case for file names (e.g., `user-profile.tsx`, `auth-service.ts`).

4. **React Specific:**

   - Use functional components and React Hooks.
   - Keep components small and focused.
   - Manage state using React Context API for global state management.
   - Use local state (useState) for component-specific state.
   - Avoid unnecessary re-renders by leveraging React.memo and useCallback.

5. **TypeScript:**
   - Use strict typing to prevent runtime errors.
   - Define interfaces and types for data structures and API responses.
   - Use ES6+ features where appropriate.
   - Prefer const and let over var.
   - Use arrow functions for anonymous functions.
   - Ensure proper error handling.

### **SQL (PostgreSQL)**

1. **Naming Conventions:**

   - Use `snake_case` for table and column names.
   - Singular nouns for table names (e.g., `user`, `budget`).

2. **Indexing:**

   - Create indexes on columns frequently used in WHERE clauses and JOINs.

3. **Normalization:**

   - Ensure the database is normalized to reduce redundancy.

4. **Security:**
   - Use parameterized queries to prevent SQL injection.

## Documentation

**Comprehensive Documentation:**

- Maintain detailed documentation for setup, deployment, API endpoints, and user guides.

- **Code Comments:**

  - Write self-documenting code where possible.
  - Use comments to explain "why" rather than "what" or "how".
  - Comment complex algorithms or business logic that isn't immediately clear.
  - Use JSDoc for documenting functions, including parameters, return types, and examples.
  - Keep comments up-to-date when changing code.
  - Avoid commented-out code in commits; use version control instead.

- **Markdown Style Guide**

  - Use GitHub Flavored Markdown
  - Link: https://github.github.com/gfm/

- **README:**

  - Maintain an up-to-date README with setup instructions, usage, and contribution guidelines.

## Testing

- **Write Tests:**

  - Aim for minimal test coverage, and only test critical functionalities.
  - Use as simple tests as possible.
  - Avoid using testing tools like Jest, Mocha, etc.
  - Use simple test scripts to test critical functionalities.
  - Use manual testing for as much as possible.
  - See actual test-backup-restore.sh for examples.

- **Test Naming:**
  - Use descriptive names for test cases to clearly indicate their purpose.

## Version Control

- **Branching Strategy:**

  - origin main

- **Commit Messages:**

  - Main message plus comments should be use during git commit -m "<message + comments>"

- **Pull Requests:**
  - Require code reviews before merging.
  - Ensure all tests pass and adhere to coding standards.

## Performance Optimization

- **Frontend:**

  Not defined

- **Backend:**

  Not defined

## Accessibility

- Ensure the application adheres to [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) guidelines.
- Use semantic HTML elements appropriately.
- Implement proper heading hierarchy (h1, h2, etc.).
- Ensure sufficient color contrast for text and important UI elements.
- Provide alternative text for images and icons.
- Ensure keyboard navigation support for all interactive elements.
- Use ARIA attributes when necessary to improve accessibility.
- Test the application with screen readers and keyboard-only navigation.

## Code Reviews

- Conduct regular code reviews to maintain code quality.
- Provide constructive feedback and encourage best practices.

## Environment-Specific Code

- Use environment variables for configuration that varies between environments.
- Avoid committing sensitive information (API keys, credentials) to version control.
- Use .env files for local development and proper deployment configurations for staging/production.
- Implement feature flags for environment-specific features when necessary.

## CSS/Styling

- Use Tailwind CSS for styling components.
- Utilize Shadcn UI components for consistent design patterns.
- Follow Tailwind's utility-first approach.
- Create custom utility classes in the Tailwind config when necessary.
- Maintain a consistent color palette and design system using Tailwind's theme customization.

---

By following these coding principles and rules, the BudgetMaster project will maintain high standards of quality, security, and performance.
