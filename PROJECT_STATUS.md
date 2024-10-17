# Tascheged - Allowance Tracker Project Status

## Recent Updates

- Decided against using an ORM for database operations, opting for direct SQL queries instead.
- Moved mock data (`mockTasks` and `mockUsers`) from `task-completion-page.tsx` to a separate file `mocks/taskCompletionData.ts` for better organization and potential reuse.
- Updated User interface in `app/types/user.ts` to include both `sound` and `soundUrl` properties.
- Resolved linter errors in `mocks/taskCompletionData.ts` related to User interface.
- Standardized import statements to use absolute imports for consistency across the project.
- Removed the `app/pages` directory as we're using Next.js 13+ with the App Router.
- Decided on React Context API for state management.
- Confirmed the use of Tailwind CSS and Shadcn for styling and UI components.
- Resolved linter error in `components/client-layout.tsx` by updating the ParentChildModeProvider in `hooks/useParentChildMode.tsx`.

## Current Focus

- Reviewing recent changes to ensure no new issues were introduced.
- Beginning implementation of loading states and error handling for data fetching.
- Implementing React Context API for global state management where necessary.
- Ensuring consistent use of Tailwind CSS across components.
- Ensuring all components and files are using the correct User interface.
- Ensuring all components are using the ParentChildModeProvider correctly.
- Planning the implementation of direct SQL queries for database operations.

## Upcoming Tasks

- Implement handling of loading states or errors when fetching data (to be addressed when moving from mockDB to actual database).
- Add pagination and filtering capability to user and task lists.
- Ensure role-based access control functionality exists at the sidebar level.
- Review the naming convention for touch-based components and consider a more consistent approach.
- Ensure consistent use of either single quotes or double quotes for string literals across all files.
- Develop SQL query templates for common database operations.

## Known Issues

- Some components may still have inconsistent naming conventions or import styles.
- The project has had significant issues with automated testing. We will avoid this by using manual testing.

## Current Tasks

| Task                      | Description                                      | Priority | Status      |
| ------------------------- | ------------------------------------------------ | -------- | ----------- |
| Implement loading states  | Add loading indicators for data fetching         | High     | In Progress |
| Refactor components       | Ensure consistent use of ParentChildModeProvider | Medium   | To Do       |
| Review naming conventions | Standardize component naming across the project  | Low      | To Do       |

## Known Issues

| Issue               | Description                                          | Priority |
| ------------------- | ---------------------------------------------------- | -------- |
| Inconsistent naming | Some components have inconsistent naming conventions | Medium   |
| TypeScript errors   | Address remaining TypeScript errors in components    | High     |

## Next Steps

1. Continue addressing items in the cleanup checklist (2024_1009-cleanUp.md).
2. Begin implementation of loading states and error handling for data fetching.
3. Start work on pagination and filtering for user and task lists.
4. Review and update any remaining documentation to reflect recent changes.

## Project Structure

The project structure has been updated to follow Next.js 13+ conventions with the App Router. Key directories include:

- `/app`: Contains the main application logic and page components.
- `/components`: Houses reusable React components.
- `/types`: Stores TypeScript type definitions.
- `/mocks`: Contains mock data for development and testing.

## Git Commit Preparation Process

When preparing for a git commit, always follow these steps:

1. Review and update the CHANGELOG.md file with any new features, changes, or fixes.
2. Update the PROJECT_STATUS.md file to reflect the current state of the project, including any completed tasks or new known issues.
3. Prepare a concise but descriptive commit message that summarizes the changes made.
4. Run any linters or tests to ensure code quality and catch any potential issues.
5. Stage the changes using `git add .`
6. Commit the changes using `git commit -m "Your prepared commit message"`
7. Push the changes to the remote repository using `git push origin main` (or the appropriate branch name)

Following these steps ensures that the project documentation remains up-to-date and that commit messages are informative and consistent.
