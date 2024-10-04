# Onboarding Guide for Taschengeld

Welcome to the Taschengeld project! This guide will help you get started with development.

## Project Overview

Taschengeld is an allowance tracker application built with Next.js, React, and TypeScript. It includes features for task management, user management, and a new Piggy Bank interface for savings management.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features

- Task Management
- User Management
- Piggy Bank Interface (New)

## Project Structure

- `/app`: Next.js app directory
- `/components`: React components
- `/public`: Static assets
- `/types`: TypeScript type definitions
- `/requirements`: Project requirements and documentation

## Development Tools

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Prettier for formatting
- ESLint for linting (currently disabled in pre-commit hook)
- Jest for testing (currently disabled in pre-commit hook)

## Piggy Bank Feature

The new Piggy Bank feature allows children to manage their savings. Key components:

- `components/piggy-bank.tsx`: Main component for the Piggy Bank interface
- `components/add-funds-modal.tsx`: Modal for adding funds
- `components/withdraw-funds-modal.tsx`: Modal for withdrawing funds
- `components/transactions-modal.tsx`: Modal for viewing transaction history

## Current Development Notes

- The pre-commit hook currently only runs Prettier formatting
- ESLint, TypeScript checking, and Jest tests are disabled in the pre-commit hook
- Refer to `CONTRIBUTING.md` for more details on the development workflow

## Additional Resources

- Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
- React Documentation: [https://reactjs.org/docs](https://reactjs.org/docs)
- TypeScript Documentation: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- Tailwind CSS Documentation: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
