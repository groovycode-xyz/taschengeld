# Taschengeld - Allowance Tracker

## Project Overview

Taschengeld is an allowance tracker application designed to help families manage chores, tasks, and allowances for children. It features a user-friendly interface for both parents and children to interact with.

## New Features

### Piggy Bank Interface

We've recently implemented a Piggy Bank feature that allows children to manage their savings. Key functionalities include:

- Viewing current balance for each child
- Adding funds to the piggy bank
- Withdrawing funds from the piggy bank
- Viewing transaction history

## Features

- ...
- Parent/Child mode toggle for controlling access to certain features
- Dynamic PiggyBank interface that adapts to Parent/Child mode
- Global state management using React Context
- ...

## Project Structure

The project follows a component-based architecture using Next.js and React. Key directories and files include:

- `/app`: Next.js app directory
- `/components`: React components
- `/public`: Static assets
- `/types`: TypeScript type definitions
- `/requirements`: Project requirements and documentation

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

- The project uses Husky for pre-commit hooks
- Prettier is used for code formatting
- ESLint is used for linting (currently disabled in pre-commit hook)
- TypeScript is used for type checking (currently disabled in pre-commit hook)

## Testing

- Jest is used for unit testing (currently disabled in pre-commit hook)

## Usage

To switch between Parent and Child modes, use the toggle switch in the sidebar. This will affect the visibility of certain features, such as the ability to add or withdraw funds in the PiggyBank interface.

## Development

This project uses Next.js 13+ with the App Router. Some components and hooks use the 'use client' directive for client-side rendering. Make sure to follow this pattern when creating new interactive components.

## Known Issues

There are currently some TypeScript and linter errors in certain components. These do not prevent the application from functioning but should be addressed in future updates. See `PROJECT_STATUS.md` for more details.

## Contributing

Please refer to `CONTRIBUTING.md` for guidelines on contributing to this project.

## License

(Include license information)
