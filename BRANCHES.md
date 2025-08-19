# Branch Documentation Registry

This file tracks all active development branches and their purposes.

## 📋 **Quick Reference**

| Branch                            | Status         | Purpose                                             | Last Updated |
| --------------------------------- | -------------- | --------------------------------------------------- | ------------ |
| `development`                     | 🟢 Active      | Main development integration branch                 | 2025-08-19   |
| `feature/svg-management-tool`     | 🟡 In Progress | Development-only SVG icon management interface      | 2025-06-26   |
| `feature/icon-system-refactor`    | 🟡 In Progress | Centralized icon system with search/filtering       | 2025-06-26   |
| `feature/enhanced-access-control` | 🟠 Planned     | Multi-device access policies and session management | 2025-06-26   |
| `saas-development`                | 🟡 In Progress | API specification and SaaS architecture planning    | 2025-08-18   |

## 📚 **Archived/Completed Features**

| Branch                            | Status              | Purpose                                             | Completed    |
| --------------------------------- | ------------------- | --------------------------------------------------- | ------------ |
| `savings`                         | 🎯 Merged to main   | Dedicated savings accounts with goal tracking       | 2025-08-19   |

## 📖 **Detailed Branch Information**

### `development`

**Purpose:** Main development integration branch  
**Status:** 🟢 Active - Clean and up to date  
**Description:** Primary branch for ongoing development work. All feature branches should be based off this branch.  
**Next Actions:** Waiting for feature branches to be completed and merged  
**Notes:** Contains latest stable development code with branch indicator feature

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
**On Hold:** Icon System Integration, SVG Management Tool
**Recently Completed:** Savings Goals Feature (merged 2025-08-19)

**Immediate Priorities:**

1. Complete SaaS development API specification
2. Design Enhanced Access Control implementation
3. Review and update paused feature branches

---

**Last Updated:** 2025-08-19  
**Current Active Branches:** 4 (excluding main)  
**Recent Changes:** Merged savings goals feature to main, cleaned up worktree, archived completed branch
