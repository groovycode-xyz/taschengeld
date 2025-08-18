# Branch Documentation Registry

This file tracks all active development branches and their purposes.

## 📋 **Quick Reference**

| Branch                            | Status         | Purpose                                             | Last Updated |
| --------------------------------- | -------------- | --------------------------------------------------- | ------------ |
| `development`                     | 🟢 Active      | Main development integration branch                 | 2025-06-26   |
| `savings`                         | ✅ Complete    | Dedicated savings accounts with goal tracking       | 2025-08-18   |
| `feature/mode-persistence`        | 🟡 In Progress | Add localStorage persistence for parent/child mode  | 2025-07-09   |
| `feature/svg-management-tool`     | 🟡 In Progress | Development-only SVG icon management interface      | 2025-06-26   |
| `feature/icon-system-refactor`    | 🟡 In Progress | Centralized icon system with search/filtering       | 2025-06-26   |
| `feature/enhanced-access-control` | 🟠 Planned     | Multi-device access policies and session management | 2025-06-26   |
| `develop`                         | 🔴 DELETE ME   | Learning branch for Git tutorials                   | 2025-06-26   |

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

### `feature/mode-persistence`

**Purpose:** Add localStorage persistence for parent/child mode state  
**Status:** 🟡 In Progress - Implementation complete, testing pending  
**Description:** Implements device-local persistence of parent/child mode state using localStorage, ensuring mode preference persists across browser sessions.

**Key Features:**
- Device-local mode persistence (no cross-device sync)
- Automatic restoration on page load
- Cross-tab synchronization within same browser
- Fallback to parent mode if no preference stored

**Current Progress:**
- ✅ localStorage initialization from stored preference
- ✅ Mode changes saved to localStorage
- ✅ Cross-tab storage event synchronization
- 🟡 Manual testing in progress
- ⏳ Production testing pending

**Technical Details:**
- Modified: `/components/context/mode-context.tsx`
- Storage key: `mode-preference`
- Values: `'parent'` or `'child'`
- Default behavior: Parent mode if not set

**Testing:**
1. Set child mode → refresh browser → verify stays in child mode
2. Set parent mode → refresh browser → verify stays in parent mode
3. Open multiple tabs → change mode in one → verify sync
4. Clear localStorage → verify defaults to parent mode

**Next Steps:**
1. Complete manual testing on all target devices
2. Verify no conflicts with existing PIN system
3. Test on actual iPad devices
4. Merge to development branch

---

### `feature/svg-management-tool`

**Purpose:** Build development-only SVG icon management interface  
**Status:** 🟡 In Progress - Upload functionality implemented  
**Description:** Creates a visual web interface for managing SVG icons without requiring code changes. Development environment only - never deployed to production.

**Key Features:**

- Drag & drop SVG file upload with processing
- Security scanning for malicious SVG content
- Visual organization (user icons vs task icons)
- Integration with existing icon registry system
- Real-time preview and metadata extraction

**Current Progress:**

- ✅ Basic upload interface completed
- ✅ File processing pipeline implemented
- ✅ Security validation framework in place
- 🟡 Icon organization UI in progress
- ⏳ Registry integration pending

**Technical Details:**

- Location: `/app/dev-tools/svg-manager/`
- API endpoints: `/api/dev-tools/icons/`
- Access: Only available when `NODE_ENV=development`
- Dependencies: Built on existing icon system foundation

**Testing:**

- Upload various SVG files and verify processing
- Confirm security scanning catches malicious content
- Test integration with icon selector components

**Next Steps:**

1. Complete icon categorization interface
2. Implement registry update functionality
3. Add bulk operations (move, delete, archive)
4. Final testing and documentation

---

### `feature/icon-system-refactor`

**Purpose:** Centralized icon system with enhanced search and filtering  
**Status:** 🟡 In Progress - Core system complete, integration ongoing  
**Description:** Replaces scattered icon handling with centralized registry supporting 154+ icons, search, filtering, and categorization.

**Key Features:**

- Centralized icon registry with metadata
- Enhanced IconSelector with search functionality
- Category-based filtering (people, objects, activities, etc.)
- Backward compatibility with existing components
- Type-safe icon definitions and usage

**Current Progress:**

- ✅ Icon registry with 154 icons completed
- ✅ Enhanced IconDisplay and IconSelector components
- ✅ Search and filtering functionality
- 🟡 Component integration in progress
- ⏳ Documentation updates pending

**Components Updated:**

- User management modals (add/edit)
- Task management modals (add/edit)
- Icon selector throughout application
- Withdraw funds modal

**Testing:**

- Verify all existing icons display correctly
- Test search functionality with various keywords
- Confirm category filtering works properly
- Check backward compatibility

**Next Steps:**

1. Complete remaining component integrations
2. Update documentation with new icon system
3. Add icon usage analytics (optional)
4. Performance testing with large icon sets

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

### `develop` ⚠️ **SCHEDULED FOR DELETION**

**Purpose:** Learning branch for Git workflow tutorials  
**Status:** 🔴 Ready for deletion  
**Description:** This branch was created for learning Git operations and contains the branch indicator feature work. The actual work has been properly committed and the branch is no longer needed.

**Contents:**

- Branch indicator feature (already committed to proper branch)
- Git workflow learning exercises
- Docker configuration updates

**Action Required:**

```bash
# Delete this branch when ready:
git branch -D develop
```

**Note:** All valuable work from this branch has been preserved in the proper feature branches.

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

**Primary:** SVG Management Tool (80% complete)  
**Secondary:** Icon System Integration (90% complete)  
**Tertiary:** Mode Persistence (95% complete)  
**Planned:** Enhanced Access Control (design phase)

**Immediate Priorities:**

1. Complete SVG tool icon organization UI
2. Finish icon system component integrations
3. Complete mode persistence testing
4. Delete learning branch `develop`
5. Plan next major feature development

---

**Last Updated:** 2025-08-18  
**Current Active Branches:** 6 (excluding main)  
**Branches Ready for Cleanup:** 1 (`develop`)
