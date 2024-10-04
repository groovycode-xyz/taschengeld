# Contributing to Tascheged

Thank you for your interest in contributing to Tascheged! To ensure consistency and maintainability, please adhere to the following guidelines:

## Code Style and Best Practices

1. Use TypeScript for all new files and components.
2. Utilize centralized type definitions from `@/types/` for shared types like User and Task.
3. Avoid redefining types that are already defined in the centralized type files.
4. Use consistent naming conventions across the project (e.g., PascalCase for components, camelCase for functions and variables).
5. Keep components focused and modular. Extract reusable logic into custom hooks or utility functions.
6. Use meaningful variable and function names that describe their purpose.
7. Comment complex logic or non-obvious code sections.
8. Write unit tests for new components and functions.

## File Structure

1. Place new components in the appropriate subdirectory within the `components/` folder.
2. Keep pages in the `app/` directory, following Next.js 13+ conventions.
3. Store shared types in the `types/` directory.
4. Place utility functions and custom hooks in the `utils/` and `hooks/` directories, respectively.

## Git Workflow

1. Create a new branch for each feature or bug fix.
2. Write clear, concise commit messages describing the changes made.
3. Keep pull requests focused on a single feature or bug fix.
4. Update the `CHANGELOG.md` file with any significant changes.

## Before Committing

1. Run `npm run format` to ensure your code is properly formatted.
2. Ensure all linter errors are resolved by running `npm run lint`.
3. Run `npm run type-check` to catch any type errors.
4. Verify that all tests pass by running `npm test`.

## Updating Types

When updating or adding new types:

1. Modify the appropriate file in the `types/` directory.
2. Update all relevant components and functions to use the new or modified type.
3. Run the TypeScript compiler to catch any type mismatches across the project.

By following these guidelines, we can maintain a consistent, high-quality codebase and minimize the occurrence of type-related issues.
