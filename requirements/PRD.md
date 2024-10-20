### **Revised Product Requirement Document (PRD) for Tascheged - Allowance Tracker**

---

## **1. Executive Summary**

### **1.1 Brief Overview of the Product**

**Tascheged - Allowance Tracker** is a kid-friendly, intuitive application designed for families to manage and track chore/task completions within the household. The app aims to make chore management fun and engaging for children while providing parents with the tools to monitor progress, allocate allowances, and foster essential life skills such as responsibility, accountability, honesty, and money management.

### **1.2 Key Objectives and Goals**

- **Track Chores/Tasks:** Enable parents to define and manage chores/tasks, and allow children to mark them as completed.
- **Payout for Completed Chores/Tasks:** Facilitate the allocation of allowances based on completed chores.
- **Build Good Traits:** Encourage the development of responsibility, accountability, honesty, money management, and family collaboration among children.

### **1.3 Target Audience**

Families with children aged 5 years and above who wish to manage chores and allowances digitally, promoting a modern and paperless approach to household task management.

### **1.4 Tech Stack**

The application utilizes a modern, open-source, and free technology stack to ensure ease of development, self-hosting capabilities, and cost-effectiveness.

| **Component** | **Technology** | **Purpose** |
| **Frontend Framework** | Next.js | Building the user interface with React, server-side rendering, and APIs. |
| **Styling** | Tailwind CSS | Utility-first CSS for responsive and customizable designs. |
| **UI Components** | shadcn/ui | Customizable UI components built on top of Radix UI and Tailwind CSS. |
| **Sound Effects** | Howler.js | Managing and playing audio effects. |
| **Backend Framework** | Next.js API Routes | Handling backend logic and APIs within the Next.js framework. |
| **Database** | PostgreSQL | Relational database for managing users, tasks, transactions, and accounts. |
| **ORM** | Prisma | Simplifying database interactions and managing migrations. |
| **Authentication** | Internal PIN-based system | Implementing role-based access control with PIN verification for parent mode |
| **Version Control** | Git with GitHub | Managing code repositories and collaboration. |
| **IDE** | Cursor AI using VS Code engine | Development environment with rich extensions and support. |
| **Design & Prototyping**| draw.io | Designing wireframes, mockups, and interactive prototypes. |

---

## **2. Product Vision**

### **2.1 Long-term Vision for the Product**

- **Home Adoption:** Establish the app as a staple in household chore management, promoting digital and interactive engagement between parents and children.
- **Marketable Product:** Potential expansion into a marketable product via touch devices (Apple/Android) or as a Software-as-a-Service (SaaS) platform, should demand arise.

### **2.2 Alignment with Company Strategy**

- **N/A:** As this is a personal project, it does not directly align with any broader company strategy.

---

## **3. Target Persona**

### **3.1 Detailed Description of Primary User Personas**

- **Parents:**
  - Manage users and permissions.
  - Define and manage tasks.
  - Supervise and approve payouts for completed chores.
  - Manage children's money accounts and approve withdrawals.
- **Children:**
  - Mark tasks as completed.
  - View their bank account balance and transaction history.

### **3.2 User Needs, Pain Points, and Goals**

- **Ease of Use:** The app must be simple enough for children as young as 5 to navigate, including those who cannot read.
- **Engaging Interface:** Incorporate fun elements like animations, sounds, and interactive features to keep children interested.
- **Responsiveness:** Ensure the app works seamlessly on touch devices such as iPads, supporting both touch and mouse inputs.

---

## **4. Problem Statement**

### **4.1 Clear Definition of the Problem Being Solved**

- **Digital Chore Tracking:** Provide a modern, paperless method for tracking children's chore completions.
- **Allowance Management:** Eliminate the inconvenience of handling physical coins by managing allowances digitally.

### **4.2 Importance of Addressing This Problem**

- **Convenience:** Physical coins can be cumbersome for children to carry and manage.
- **Practicality:** Many stores do not accept all types of coins, limiting their usability.

---

## **5. Product Goals and Success Metrics**

### **5.1 Specific, Measurable Goals for the Product**

- **Daily Adoption:** Ensure daily usage by children, with immediate task marking post-chore completion.
- **Engagement:** Children should be eager to use the app to check their progress and account balances.
- **Chore Participation:** Increase children's interest in doing chores, earning money, and managing their finances.

### **5.2 Key Performance Indicators (KPIs) to Track Success**

- **Daily Active Users (DAU):** Number of children using the app each day.
- **Task Completion Rate:** Percentage of assigned tasks marked as completed.
- **Allowance Allocation Frequency:** Number of payouts processed monthly.
- **User Satisfaction:** Feedback ratings from parents and children.

---

## **6. Features and Requirements**

### **6.1 Core Features**

#### **6.1.1 Overall Application Interface**

- **Purpose:** Acts as the main user front-end, allowing full interaction with all app features based on user roles.
- **Priority:** 1
- **User Story:** As a user, I want to see different views based on my role (Parent or Child) to access relevant functionalities.
- **Features:**
  - **Layout/Look:** Visually appealing and intuitive design tailored for ease of use by children and parents.
  - **Parent Mode Toggle:** Switch to Parent Mode requiring PIN verification.
  - **Configuration Icon:** Access global settings for initial setup and role management.
  - **Role-Based Views:** Enable full functionality in Parent Mode and restricted functionality in Child Mode.
  - **Global Settings:**
    - **PIN Management:** Set and manage a Global PIN for Parent Mode access.
    - **Reset Options:** Options to reset users, tasks, and accounts with appropriate warnings.

#### **6.1.2 User Management Interface**

- **Purpose:** Allows parents to create, manage, and assign roles to user accounts.
- **Priority:** 1
- **User Story:** As a parent, I want to manage user profiles to assign roles and oversee permissions.
- **Features:**
  - **User Accounts/Profiles:** Fields include Name, Icon/Image, Sound, Birthday, and User Role.
  - **Access Management:** Ensure at least one Parent account exists and restrict role modifications accordingly.

#### **6.1.3 Task Management Interface**

- **Purpose:** Enables parents to create and manage tasks that children can complete.
- **Priority:** 1
- **User Story:** As a parent, I want to define tasks so my children know their responsibilities.
- **Features:**
  - **Task Fields:** Title, Description, Icon/Image, Sound, Payout Value, and Visibility Status.
  - **CRUD Operations:** Create, read, update, and delete tasks.
  - **Visibility Control:** Toggle tasks as Active or Inactive without deleting them.

#### **6.1.4 Piggy Bank Account Interface**

- **Purpose:** Manages children's allowance accounts, allowing tracking of balances and transactions.
- **Priority:** 1
- **User Story:** As a child, I want to view my allowance balance and transaction history to manage my money.
- **Features:**
  - **View Balances:** Display current account balances.
  - **Add Transactions:** Parents can credit or debit accounts, with details and attachments.
  - **Edit Transactions:** Parents can modify or delete transactions as needed.
  - **Attachments:** Allow photos or media to be attached to transactions.

#### **6.1.5 Reporting and Payday Interface**

- **Purpose:** Allows parents to review completed tasks and approve payouts.
- **Priority:** 1
- **User Story:** As a parent, I want to approve completed tasks to allocate allowances to my children.
- **Features:**
  - **Task Review:** View and approve or reject completed tasks.
  - **Bulk Actions:** Approve or reject multiple tasks simultaneously.
  - **Grouping and Filtering:** Organize tasks by child, task name, or time intervals.
  - **Transaction Logging:** Automatically log approved tasks as transactions in Piggy Bank Accounts.

#### **6.1.6 Task Completion Interface**

- **Purpose:** Enables children to mark tasks as completed in a fun and interactive manner.
- **Priority:** 1
- **User Story:** As a child, I want to mark tasks as done in an engaging way so I can earn my allowance.
- **Features:**

  - **Task List:** Display active tasks as colorful, clickable buttons with icons.
  - **Completion Modal:** Interactive interface with drag-and-drop mechanics to mark tasks as complete.
  - **Animations and Sounds:** Celebrate task completion with animations and sound effects.
  - **Ease of Use:** Designed for children as young as 5, with large touch targets and minimal text.

  ### **6.1.6 Global App Settings**

- **Purpose:** Allows the first user of the app to make global setting decisions.
- **Priority:** 1
- **User Story:** The parent will define the global settings for the app.
- **Features:**
- **Enforce Parent / Children role distinctions** (Yes or No toggle) (default is No)
  - **Hint text:** This is for those people who do not want to "mess" with toggling between Parent mode and verifying they are a Parent.
    - If **No**
      - Then Role Based Access and any related configurations or restrictions will be lifted and everything will operate in Parent mode at all times.
      - Then the Toggle Switch to Enable Parent Mode (found at the bottom of the sidebar.tsx on the Overall Application Interface) will be greyed out on the Overall Application Interface (since it will serve no purpose with this No setting).
    - If **Yes**, then all Role Based Access configurations, restrictions, functionality, et al, will be enforced.
      - This includes if someone wants to enter the these global settings under the Application Configuration Icon
      - Field appears, "Global PIN:" (4 digits) (default value is empty)
        - **Hint text:** Use this PIN to enter Global Settings. This PIN may also be used anytime user is required to verify they are a Parent when using the Parent toggle switch within the application.
  - **Reset Settings**
    - **Hint text:** "Warning, these options will have irreversible consequences. Do not use unless you are aware that you will need to recreate any data that is deleted by taking these actions."
    - **Reset and erase all Users of the app**
      - **Hint text:** Will delete all users. Not reversible. You will need to create new users. The default built-in Parent User will be recreated automatically just like a new installation of the app.
    - **Reset and erase all defined Tasks**
      - **Hint text:** Will delete all currently defined Tasks, as well as all Task completion history. Not reversible. You will need to create new Tasks.
    - **Reset and erase all Piggy Bank Account Balances**
      - **Hint text:** Will delete all Bank Accounts of all users. Will delete all transactions and history. Not reversable.

### **6.2 Nice-to-Have Features**

- **Audio Message Attachments:** Allow children to record and attach audio messages when marking tasks as completed.
- **Duplicate Task Indicators:** Notify users if a task has recently been marked as complete to prevent accidental duplicate entries.
- **Custom Terminology and Number Formatting:** Enable customization of terms and currency formats for future enhancements.

### **6.3 Technical Requirements**

#### **6.3.1 Platform Requirements**

- **Compatibility:** Must support touch-based interfaces (iPads, tablets) and mouse inputs.
- **Self-Hosting:** Designed to run on a home server, homelab, or Docker container.
- **Web-Based Application:** Accessible via web browsers with touch support.
- **Database:** Utilize PostgreSQL for robust data management and storage.
- **Database Access:** Use direct SQL queries for database interactions.
- **Coding Language:** Primarily JavaScript/TypeScript with Next.js and React for the frontend and backend.

#### **6.3.2 Performance Requirements**

- **Optimized for Local Hosting:** Ensure the application runs smoothly on local networks without significant latency.

#### **6.3.3 Security Requirements**

- **Role-Based Access Control (RBAC):** Differentiate functionalities based on Parent and Child roles.
- **PIN Security:** Secure storage and verification of PINs using bcrypt hashing.
- **Data Encryption:** Implement HTTPS for secure data transmission and encrypt sensitive data in the database.
- **Access Management:**
  - **Parents:** Full access to all functionalities.
  - **Children:** Restricted access based on role specifications.

#### **6.3.4 Integration Requirements**

- **None:** The application is self-contained with no external integrations required at this stage.

### **6.4 User Experience Requirements**

#### **6.4.1 Usability Goals**

- **Simplicity:** Intuitive and straightforward interface suitable for children and parents.
- **Engagement:** Incorporate playful elements like animations and sounds to maintain user interest.
- **Responsiveness:** Ensure seamless operation on various devices, particularly touch-enabled ones.

#### **6.4.2 Accessibility Requirements**

- **Touch and Mouse Input:** Support both touch-based interactions and traditional mouse inputs.
- **Future Enhancements:** Plan for potential accessibility features to accommodate users with disabilities.

#### **6.4.3 Design Principles or Guidelines**

- **Well-Documented Code:** Ensure code is thoroughly commented and documented.
- **Visually Pleasing:** Use bright colors, large buttons, and intuitive icons to appeal to children.
- **Responsive and Intuitive:** Design interfaces that adapt to different screen sizes and are easy to navigate.

---

## **7. User Flow and Interaction**

### **7.1 High-Level User Journey Map**

1. **User Access:**

   - **Parent:** Access Parent Mode using the toggle switch with PIN verification.
   - **Child:** Access Child Mode directly without PIN.

2. **Parent Actions:**

   - **User Management:** Create and manage user accounts.
   - **Task Management:** Define and assign tasks.
   - **Review Tasks:** Approve or reject completed tasks.
   - **Manage Allowance:** Allocate funds and manage transactions.

3. **Child Actions:**
   - **View Tasks:** See available tasks and mark them as completed.
   - **Track Allowance:** View account balance and transaction history.

### **7.2 Key User Interactions and Touch Points**

- **Parent Mode Toggle:** Switch between Parent and Child modes with secure PIN verification.
- **Task Creation:** Parents define tasks with details and payout values.
- **Task Completion:** Children interact with task buttons to mark tasks as done, triggering animations and sounds.
- **Allowance Approval:** Parents review and approve tasks, allocating funds to children's accounts.
- **Transaction Management:** Parents add, edit, or delete transactions as needed.

---

## **8. Constraints and Assumptions**

### **8.1 Budget Constraints**

- **Open-Source and Free Tools:** Utilize entirely open-source and free tools for the final product.
- **Development Tools:** Can use licensed or paid tools if absolutely necessary, with decisions guided by the Product Owner.

### **8.2 Timeline Constraints**

- **Flexible Timeline:** No strict deadlines, as this is a hobby project for personal and family use.

### **8.3 Technical Constraints**

- **Non-Programmer Product Owner:** Development instructions and project management will be guided by AI assistants and tools, given the Product Owner’s lack of programming experience.

### **8.4 Business or Legal Constraints**

- **None:** No specific business or legal constraints identified.

### **8.5 Key Assumptions Made in Planning**

- **Stable Requirements:** Initial requirements will remain relatively stable, with future enhancements considered for later phases.

---

## **9. Dependencies**

### **9.1 External Systems or Services Required**

- **Version Control:** GitHub for repository management.
- **AI Assistance Tools:** Utilizing AI coding assistants such as ChatGPT for development guidance.

### **9.2 Internal Dependencies**

- **Product Owner:** James, who will provide input and oversight.
- **Development Team:** Primarily AI-driven development with guidance from the Product Owner.

---

## **11. Risks and Mitigation Strategies**

### **11.1 Potential Risks to Project Success**

- **Technical Complexity:** Implementing interactive features like drag-and-drop for young children.
- **Resource Limitations:** Limited programming expertise and reliance on AI-driven development.
- **Scope Creep:** Adding too many features beyond the MVP, delaying the project.

### **11.2 Strategies to Mitigate Identified Risks**

- **Technical Challenges:**
  - Allocate time for research and prototyping complex features.
  - Utilize established libraries and frameworks (e.g., Framer Motion, Howler.js) to simplify implementations.
- **Resource Limitations:**
  - Leverage AI coding assistants and online tutorials.
  - Seek community support from open-source tool communities for troubleshooting and guidance.
- **Scope Creep:**
  - Adhere strictly to MVP features initially.
  - Reevaluate and prioritize additional features for future releases based on user feedback and project progress.

---

## **12. Success Criteria and Acceptance Tests**

### **12.1 Specific Criteria for Considering the Product Successful**

- **Functionality:** All core features as outlined are fully implemented and operational.
- **Usability:** The app is easy to use for both parents and children, with intuitive navigation and engaging interactions.
- **Stability:** The application runs smoothly without critical bugs or performance issues.
- **Security:** Sensitive data such as PINs and transactions are securely handled and stored.
- **Adoption:** Consistent daily usage by children and active management by parents.

### **12.2 High-Level Acceptance Tests for Key Features**

- **User Management:**
  - Verify that parents can create, edit, and delete user accounts.
  - Ensure that at least one Parent account remains and cannot be deleted or downgraded.
- **Task Management:**

  - Confirm that parents can create, edit, activate/deactivate, and delete tasks.
  - Ensure that only active tasks are visible to children.

- **Task Completion:**
  - Test that children can mark tasks as completed through the interactive interface.
  - Verify that animations and sounds trigger appropriately upon task completion.
- **Piggy Bank Account:**

  - Ensure that transactions are accurately logged and balances are updated correctly.
  - Test the addition, editing, and deletion of transactions by parents.

- **Reporting and Payday:**

  - Verify that parents can approve or reject completed tasks.
  - Ensure that approved tasks correctly allocate funds to children's accounts.

- **Security:**

  - Test PIN verification for accessing Parent Mode.
  - Ensure that role-based access controls are enforced properly.

- **Deployment:**
  - Confirm that the application deploys correctly on a self-hosted environment.
  - Verify that all services (frontend, backend, database) communicate seamlessly.

---

## **13. Future Considerations**

### **13.1 Potential Future Enhancements**

- **Custom Terminology and Number Formatting:**

  - Allow users to customize terms (e.g., Parent, Child, Task) and currency formats to suit different languages and regions.

- **Audio Message Attachments:**

  - Enable children to record and attach audio messages when marking tasks as completed.

- **Duplicate Task Indicators:**

  - Implement notifications to prevent accidental duplicate task completions.

- **SaaS Expansion:**

  - Consider transitioning the app to a SaaS model for broader market reach, including multi-tenancy and user onboarding features.

- **Mobile App Development:**
  - Explore converting the web application into native iOS and Android apps using frameworks like React Native or Flutter.

### **13.2 Long-Term Roadmap Considerations**

- **Scalability:** Design the architecture to support potential scaling beyond personal use, including handling multiple families or larger user bases.
- **Internationalization:** Prepare the app to support multiple languages and currencies from the outset to facilitate future international adoption.
- **Accessibility Features:** Incorporate accessibility options to support users with disabilities without significant redesign.

---

## **14. Stakeholders and Approvals**

### **14.1 List of Key Stakeholders**

- **Product Owner:** James
- **Family Members:** Mommy, Eliana, Ariel
- **AI Coding Assistants:** AI coding assistants

### **14.2 Approval Process and Sign-offs Required**

- **Product Owner:** Sole authority for approving project decisions, designs, and implementations.

---

## **15. Appendices**

### **15.1 Wireframes or Mockups**

/requirements/TG-Wireframe1-jpg

- **Wireframes:** To be created using Draw.io, illustrating layouts for all core interfaces including User Management, Task Management, Piggy Bank Accounts, Reporting and Payday, and Task Completion.
- **Mockups:** High-fidelity designs incorporating colors, icons, animations, and sound elements as per user experience requirements.

### **15.2 Market Research Data**

- **Not Applicable:** As this is a personal home project, no market research is conducted.

### **15.3 Competitive Analysis**

- **Not Applicable:** No competitive analysis is required for personal use.

### **15.4 Technical Architecture Diagrams**

- **Architecture Diagrams:** Detailed diagrams showcasing the interaction between frontend, backend, and database components using Next.js, PostgreSQL.
- **Data Flow Diagrams:** Visual representations of data movement between different parts of the application.

---

## **16. Technical Stack Integration**

### **16.1 Frontend Integration**

- **Next.js 14:** Utilize Next.js for building the React-based frontend with server-side rendering and API route capabilities.
- **Tailwind CSS:** Apply utility-first CSS for responsive and customizable designs.
- **Material-UI (MUI):** Implement pre-built, accessible UI components for consistency and ease of use.
- **Framer Motion & Howler.js:** Integrate animations and sound effects to enhance user engagement.

### **16.2 Backend Integration**

- **Next.js API Routes:** Develop backend functionalities within the Next.js framework for seamless integration.
- **PostgreSQL:** Use as the primary database for storing all application data.
- **Database Access:** Use direct SQL queries for database interactions.
- **Coding Language:** Primarily JavaScript/TypeScript with Next.js and React for the frontend and backend.

### **16.3 Deployment Integration**

- **Docker & Docker Compose:** Containerize the application for consistent deployment across different environments.
- **Self-Hosting:** Deploy the application on a home server or homelab using Docker containers to manage frontend, backend, and database services.


