Project Onboarding Guide

Welcome!

Welcome to the team. This guide will help you understand our project, team structure, and best practices to ensure a smooth collaboration.

1. Introduction

	•	Purpose: Provide essential information for new team members to integrate effectively and contribute successfully.
	•	Audience: Experienced coders and AI coding assistants joining the project.

2. Getting Started

	1.	Read the Product Requirements Document (PRD)
	•	Location: /requirements/PRD.md
	•	Purpose: Understand project goals, requirements, and scope.
	2.	Check Project Status
	•	File: PROJECT_STATUS.md
	•	Purpose: Review the current state before starting any new work.
	3.	Review Changelog
	•	File: CHANGELOG.md
	•	Purpose: Stay updated with recent changes and updates.
	
	4.  Review Overview drawing
	•	File: /requirements/overview1.jpg
	•	Purpose: Understand the project's overall structure and flow.

	5.  Review Directory Tree
	•	File: directory_tree.txt
	•	Purpose: Understand the project's file structure and organization.  You may want to ask for this to be refresh as soon as you join the project.

3. Team Structure

	•	Product Owner & Project Manager:
		•	Role: Oversees project direction and success.
		•	Note: Not an experienced coder; rely on them for project guidance.
			Responsiblities:
			- Will not edit code.
			- Will perform user interface testing and provide feedback.
			- Will run terminal commands.
			- Will perform git operations.
	
	•	Development Team:
		•	Composition: AI Coders and experienced developers.
		•	Focus: Follow project rules and maintain consistency.
			Responsiblities:
			- Will edit code, but only after receiving approval from the Product Owner.
			- Will provide git commit messages that are clear and descriptive.

4. Ground Rules

	1.	Have Fun!
	•	Enjoy your work and contribute positively.
	2.	Be Collaborative and Supportive:
	•	Foster a friendly and optimistic team environment.
	3.	Effective Communication:
	•	Ask Questions: When in doubt, seek clarification.
	•	Document Well: Ensure code is self-explanatory and well-commented.
	4.	Code Practices:
	•	Understand Requirements: Always consider the big picture before coding.
	•	Incremental Changes: Avoid large, disruptive changes; break tasks into manageable steps.
	•	Avoid Duplication: Write dynamic and flexible code following best practices.
	5.	Use Existing Technologies:
	•	Prefer existing stack components; seek approval before adding new modules.
	•	Justify the need and benefits of any new technology.
	6.	Change Management:
	•	Small Steps: Implement changes incrementally for easier validation.
	•	Changelog Maintenance: Update CHANGELOG.md with all modifications.
	7.	Preparation for Successor:
	•	Assume your work will be reviewed by others.
	•	Make your code clear and maintainable for future team members.

## Task Management

The Task Management interface has been enhanced with the following features:
- A wide range of task-specific icons available for selection
- Improved Add and Edit Task modals with visual icon selection
- Filtering and sorting capabilities for better task organization

When creating or editing tasks, pay attention to the new icon selection feature, which allows for better visual representation of different task types.


##

/Users/jamespace/Projects/tgeld
├── .git (hidden)
├── .next (hidden)
├── app
│ ├── fonts
│ ├── types
│ │ └── user.ts
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components
│ ├── ui
│ │ └── button.tsx
│ ├── add-task-modal.tsx
│ ├── add-user-modal.tsx
│ ├── delete-confirmation-modal.tsx
│ ├── edit-task-modal.tsx
│ ├── edit-user-modal.tsx
│ ├── icon-component.tsx
│ ├── icon-selector.tsx
│ ├── payday-interface.tsx
│ ├── payday.tsx
│ ├── select-icon-modal.tsx
│ ├── select-sound-modal.tsx
│ ├── select-user-sound-modal.tsx
│ ├── task-management.tsx
│ ├── user-card.tsx
│ └── user-management.tsx
├── lib
│ └── utils.ts
├── pages
│ └── api
│ ├── sounds.ts
│ └── user-sounds.ts
├── public
│ ├── icons
│ ├── images
│ └── sounds
│ ├── tasks
│ └── users
├── requirements
│ ├── frontend_instructions.md
│ ├── PRD.md
│ └── tree.txt
├── CHANGELOG.md
├── components.json
├── next.config.mjs
├── package.json
├── PROJECT_STATUS.md
├── README.md
├── tailwind.config.ts
└── tsconfig.json

This structure reflects the current state of the project, including the recently implemented Payday interface and User Management components.

You can also also run the python script in the root of the project to generate a tree of the project (directory_tree.py) which will output a new directory_tree.txt file every time you run it.
