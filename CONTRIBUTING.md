# Contributing to Taschengeld

We welcome contributions to the Taschengeld project! This document outlines the process for contributing and some guidelines to follow.

## Development Workflow

1. Fork the repository and create your branch from `main`.
2. Install dependencies using `npm install`.
3. Make your changes and ensure they are properly formatted using Prettier.
4. Write or update tests for your changes if applicable.
5. Run the test suite to ensure all tests pass.
6. Create a pull request with a clear title and description.

## Code Style

- We use Prettier for code formatting. Run `npm run format` before committing.
- Follow the existing code style and patterns in the project.

## Commit Messages

- Use clear and descriptive commit messages.
- Start the commit message with a verb in the imperative mood (e.g., "Add feature" not "Added feature").

## Pull Requests

- Provide a clear description of the changes in your pull request.
- Link any relevant issues in the pull request description.
- Ensure all tests pass and there are no linting errors.

## Current Development Notes

- ESLint and TypeScript checking are currently disabled in the pre-commit hook.
- Jest tests are also disabled in the pre-commit hook.
- Only Prettier formatting is run automatically before commits.

## Questions

If you have any questions or need further clarification, please open an issue or contact the project maintainers.
