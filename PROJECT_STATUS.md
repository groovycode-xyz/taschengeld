# Tascheged - Allowance Tracker Project Status

## Recent Updates

- - Task Completion interface harmonized.  Task cards and User cards same look and feel and behavior across both touch and non-touch devices.  Icons appear as expected.  Text on each icons appear as expected. Hover over causes drop shadow for all cards as expected. Changelog revision [v.0.1.3](CHANGELOG.md).

## Current Focus

- Fixing minor UI/UX issues without losing any existing functionality.
- Migrating all interfaces from use of mock data to using the PosgreSQL datbase. (See ## Upcoming Tasks for details.)
- Implementing a backend API for handling CRUD operations on the database. (See ## Upcoming Tasks for details.)

## Upcoming Tasks

- [ ] Make the **Task Completion** interface more visually appealing, simple for kids to use, while keeping the functionality the same.

  - [x] Task card should display its icon, large.
  - [x] Task card should display the task name in small text below the icon.
  - [x] User card should display the user's icon.
  - [x] User card should display the user's name in small text below the icon.
  - [ ] Complete the **Task Completion** interface by fixing the undesired behavior where all user cards in a user_row are acknowledging the task completion by flashing the green color.
  - [ ] Create **completed_tasks** table in the database for supporting the **Task Completion** interface and the **Payday** interface.
  - [ ] Create API endpoints for **completed_tasks** table.

- [ ] Complete the **Piggy Bank** interface.

  - [ ] Create **piggybank_accounts** table in the database for supporting the **Piggy Bank** interface.
  - [ ] Create API endpoints for **piggybank_accounts** table.
  - [ ] Create **piggybank_transactions** table in the database for supporting the **Piggy Bank** interface and the **Payday** interface.
  - [ ] Create API endpoints for **piggybank_transactions** table.
  - [ ] Add functionality to the **User Management** interface to allow for adding a piggy bank account to a user, both in the **Add User** modal and the **Edit User** modal.
    - [ ] Include logic to determine if a **piggybank_accounts** for the user already exists, and if so, to choose that account instead of creating a new one, or if it does not exist, to create a new one.
    - [ ] Add appropriate field to the **Add User** modal and **Edit User** modal to indicate that a **piggybank_accounts** is linked to that user.
  - [ ] Transition the **Piggy Bank** interface from using mock data to the **piggybank_accounts** and **piggybank_transactions** tables, without losing any existing functionality.

- [ ] Complete the **Payday** interface.
  - [ ] Migrate the **Payday** interface from using mock data to using the **completed_tasks** and **piggybank_transactions** tables, without losing any existing functionality.
  - [ ] Ensure that the **Payday** interface works the same as it did when using mock data.

## Known Issues

- In the **User Management** interface

  - On the **Edit User** modal
    - The value in the **Birthday** field is not being shown from the database. The behavior is different in different browsers.
      - On **Safari** browser, it is showing the same value for all users "10/20/2024".
      - On **Arc** browser, it simply shows "dd.mm.yyyy" - but no numeric/date value from the database.
    - In the area of the **User Sound**, when a sound is shown to be defined, clicking the **Play** button does not play the sound. This behavior is consistent across all browsers.
  - On the **Add User** modal
    - On **Safari** browser (only), the value in the **Birthday** field is pre-populated with "10/20/2024". This should not be the case. The value in the field should be "dd.mm.yyyy"
    - In the area of the **User Sound**, when a sound is shown to be defined, clicking the **Play** button does not play the sound. This behavior is consistent across all browsers.

- In the **Task Completion** interface

  - When a task is **completed by dragging and dropping** the task card to a user card in the user_row, all of the user cards in the user_row are acknowledging the task completion by flashing the green color. This behavior is undesired because the desired behavior is that only the user card to which the task card was dragged and dropped will acknowledge the task completion by flashing the green color.

- Some components may still have inconsistent naming conventions or import styles.

## Current Tasks

## Next Steps

## Project Structure
