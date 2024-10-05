# Contributing to Taschengeld

We welcome contributions to the Taschengeld project! This document outlines the process for contributing and some guidelines to follow.

## Development Workflow

1. Fork the repository and create your branch from `main`.
2. Install dependencies using `npm install`.
3. Make your changes.
4. Create a pull request with a clear title and description.

## Code Style

- Follow the existing code style and patterns in the project.
- Note that automatic code formatting and linting have been removed from the project workflow.

## Commit Messages

- Use clear and descriptive commit messages.
- Start the commit message with a verb in the imperative mood (e.g., "Add feature" not "Added feature").

## Pull Requests

- Provide a clear description of the changes in your pull request.
- Link any relevant issues in the pull request description.

## Current Development Notes

- Automatic linting, type-checking, and testing have been removed from the project workflow.
- Developers are responsible for ensuring code quality before submitting pull requests.

## Project Structure

- `hooks/useParentChildMode.tsx`: Contains the ParentChildModeProvider and useParentChildMode hook for managing the global Parent/Child mode state.
- `components/ClientLayout.tsx`: A client-side wrapper component that applies the ParentChildModeProvider to the application.

## Development Guidelines

- When adding new features, consider whether they should be restricted based on the Parent/Child mode.
- Use the `useParentChildMode` hook to access the current mode in components that need to adapt their behavior or UI.
- For components that use React hooks or browser APIs, remember to add the 'use client' directive at the top of the file.
- Be aware of existing TypeScript and linter errors, and aim to resolve them as part of the development process.
- When modifying components, ensure that type definitions are correctly updated and imported.

## Current Challenges

- There are TypeScript and linter errors in some components (e.g., piggy-bank.tsx, ClientLayout.tsx) that need to be addressed.
- Type definitions for some modal components (AddFundsModal, WithdrawFundsModal, TransactionsModal) may need to be reviewed and updated.

## Questions

If you have any questions or need further clarification, please open an issue or contact the project maintainers.
