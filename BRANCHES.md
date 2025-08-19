# Branch Documentation Registry

This file tracks all active development branches and their purposes.

## 📋 **Quick Reference**

| Branch                            | Status         | Purpose                                             | Last Updated |
| --------------------------------- | -------------- | --------------------------------------------------- | ------------ |
| `development`                     | 🟢 Active      | Main development integration branch                 | 2025-08-18   |
| `savings`                         | ✅ Complete    | Dedicated savings accounts with goal tracking       | 2025-08-18   |
| `feature/svg-management-tool`     | 🟡 In Progress | Development-only SVG icon management interface      | 2025-06-26   |
| `feature/icon-system-refactor`    | 🟡 In Progress | Centralized icon system with search/filtering       | 2025-06-26   |
| `feature/enhanced-access-control` | 🟠 Planned     | Multi-device access policies and session management | 2025-06-26   |
| `saas-development`                | 🟡 In Progress | API specification and SaaS architecture planning    | 2025-08-18   |

## 📖 **Detailed Branch Information**

### `development`

**Purpose:** Main development integration branch  
**Status:** 🟢 Active - Clean and up to date  
**Description:** Primary branch for ongoing development work. All feature branches should be based off this branch.  
**Next Actions:** Waiting for feature branches to be completed and merged  
**Notes:** Contains latest stable development code with branch indicator feature

---

### `savings`

**Purpose:** Dedicated savings accounts with goal tracking and progress visualization  
**Status:** ✅ Complete - Ready for merge  
**Description:** Comprehensive savings goal functionality allowing children to create dedicated savings accounts separate from their main piggy bank accounts, with goal tracking, progress visualization, and transaction management.

**Implemented Features:**

- **Goal Management**: Create/edit savings goals with title, description, target amount, and 137+ task icons
- **Progress Tracking**: Visual progress bars with current balance and percentage display
- **Transaction System**: Contribute from piggy bank, withdraw to piggy bank, or make purchases
- **Goal States**: Active/inactive management with completion tracking
- **User Association**: Each goal belongs to a specific child with prominent user icon display
- **Filter & Sort**: Comprehensive filtering by user/status and sorting by multiple criteria
- **Transaction History**: Modal showing detailed transaction history with weekly grouping
- **Bidirectional Transactions**: Full audit trail in both savings goals and piggy bank records

**Database Schema (Implemented):**

**SavingsGoal Table:**

- `goal_id` (serial, primary key)
- `user_id` (integer, foreign key to User)
- `title` (varchar, goal name)
- `description` (text, goal details)
- `target_amount` (decimal, savings target)
- `current_balance` (decimal, current saved amount)
- `icon_name` (varchar, goal icon identifier)
- `is_active` (boolean, goal status)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**SavingsGoalTransaction Table:**

- `transaction_id` (serial, primary key)
- `goal_id` (integer, foreign key to SavingsGoal)
- `amount` (decimal, transaction amount)
- `transaction_type` (enum: 'contribute', 'withdraw', 'purchase')
- `description` (varchar, transaction details)
- `from_piggybank` (boolean, if transferred from piggy bank)
- `transaction_date` (timestamp)

**User Experience Features:**

1. **Savings Dashboard**: Grid layout with filter/sort controls
2. **Goal Cards**: Visual progress, user icons, and action buttons
3. **Create/Edit Goals**: Full modal with 137+ icon choices
4. **Transaction Modals**: Contribute, withdraw, and purchase workflows
5. **Transaction History**: Detailed modal with weekly grouping and color coding
6. **Filter Controls**: By user, status (all/active/inactive), with sort by title/progress/user/target
7. **Child-Friendly UI**: Large user icons for non-reading children recognition

**Completed Implementation:**

- ✅ Database schema and Prisma models
- ✅ Complete API endpoints (CRUD, transactions)
- ✅ UI components and modals
- ✅ Transaction workflow logic
- ✅ Progress visualization
- ✅ Bidirectional transaction tracking
- ✅ Filter and sort functionality
- ✅ Icon system integration
- ✅ User icon visibility enhancements
- ✅ Transaction history modal
- ✅ Full testing and validation

**Technical Achievements:**

- **Complete API**: RESTful endpoints with validation
- **Atomic Transactions**: Prisma transactions ensure data consistency
- **Rich UI**: Modern card-based layout with comprehensive controls
- **Accessibility**: Large icons and clear visual hierarchy for children
- **Performance**: Optimized filtering and sorting with React.useMemo
- **Integration**: Seamless piggy bank account integration

**Ready for Production:**

- All functionality implemented and tested
- Database migrations completed
- API endpoints documented and validated
- UI/UX optimized for family use
- Transaction integrity maintained

---

### `saas-development`

**Purpose:** API specification and SaaS architecture planning  
**Status:** 🟡 In Progress - API design phase  
**Description:** Comprehensive API documentation and planning for potential SaaS expansion of the Taschengeld platform.

**Current Progress:**

- ✅ API specification document created
- 🟡 Multi-tenant architecture planning
- ⏳ Authentication system design pending

**Next Steps:**

1. Complete API endpoint documentation
2. Design multi-tenant data isolation
3. Plan migration path from single-family to multi-tenant

---

### `feature/svg-management-tool`

**Purpose:** Build development-only SVG icon management interface  
**Status:** 🟠 On Hold - Awaiting icon system completion  
**Description:** Creates a visual web interface for managing SVG icons without requiring code changes. Development environment only - never deployed to production.

**Dependencies:** Requires completion of `feature/icon-system-refactor`

**Next Steps:** Resume after icon system refactor is merged

---

### `feature/icon-system-refactor`

**Purpose:** Centralized icon system with enhanced search and filtering  
**Status:** 🟠 Paused - Awaiting design decisions  
**Description:** Replaces scattered icon handling with centralized registry supporting 154+ icons, search, filtering, and categorization.

**Current Status:** Core functionality complete, integration decisions pending

**Next Steps:** Resume after current feature priorities are complete

---

### `feature/enhanced-access-control`

**Purpose:** Multi-device access policies and improved session management  
**Status:** 🟠 Planned - Design phase  
**Description:** Enhances the family-friendly access control system with device-specific policies and better session persistence.

**Planned Features:**

- Device-specific access policies
- Session persistence across browser restarts
- Admin failsafe for PIN recovery
- Multi-device policy management
- Improved parent/child mode switching

**Design Goals:**

- Maintain family-friendly, kiosk-style operation
- Support different policies per device (iPad vs family computer)
- Keep simple for non-technical family members
- Provide admin override capabilities

**Implementation Plan:**

1. **Phase 1:** Session persistence and admin failsafe
2. **Phase 2:** Device detection and registration
3. **Phase 3:** Policy engine and management UI
4. **Phase 4:** Testing and documentation

**Dependencies:**

- Requires completion of icon system work
- Should integrate with existing PIN system
- Must maintain backward compatibility

**Next Steps:**

1. Complete detailed technical design
2. Create implementation timeline
3. Begin with session persistence improvements
4. Add admin failsafe mechanisms

---

## 🔄 **Branch Lifecycle Management**

### **Creating New Branches**

1. **Always start from `development`**:

   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```

2. **Document immediately**:

   - Add entry to this BRANCHES.md file
   - Set branch description: `git config branch.$(git branch --show-current).description "Purpose: Brief description"`
   - Create initial commit with documentation

3. **Use descriptive naming**:
   - `feature/` - New functionality
   - `hotfix/` - Critical production fixes
   - `refactor/` - Code improvements without new features
   - `docs/` - Documentation-only changes

### **Maintaining Branches**

- **Update status regularly** in this file
- **Keep branch descriptions current**
- **Merge from development periodically** to stay current
- **Document major milestones** and blockers

### **Completing Branches**

1. **Final testing** on the branch
2. **Update documentation** (mark as complete)
3. **Create Pull Request** with reference to this documentation
4. **After merge**: Delete branch and remove from active list

## 🎯 **Branch Strategy Summary**

- **`main`**: Production releases only
- **`development`**: Integration branch for ongoing work
- **`feature/*`**: Individual features and enhancements
- **`hotfix/*`**: Critical production fixes
- **Clean up completed branches** to avoid clutter

## 📱 **Current Development Focus**

**Primary:** SaaS Development (API specification phase)  
**Secondary:** Enhanced Access Control (design phase)  
**Completed:** Savings Goals Feature (100% complete)
**On Hold:** Icon System Integration, SVG Management Tool

**Immediate Priorities:**

1. Complete SaaS development API specification
2. Design Enhanced Access Control implementation
3. Review and update paused feature branches

---

**Last Updated:** 2025-08-18  
**Current Active Branches:** 5 (excluding main)  
**Recent Changes:** Completed savings goals feature, cleaned up completed branches (`celebration-toggle`, `editable-payouts`)
