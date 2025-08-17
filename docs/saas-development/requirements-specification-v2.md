# Requirements Specification v2 - Taschengeld SaaS

**Document Version**: 2.1  
**Date**: 2025-07-09  
**Status**: Living Document  
**Latest Review**: 2025-07-09  
**Project**: Taschengeld SaaS Transformation  
**Philosophy**: Household Management Tool (Not a Children's App)

## Executive Summary

Taschengeld is a **household management tool** that allows subscribers to track tasks, responsibilities, and rewards within their household. Like Excel or a whiteboard, it provides structure for families to implement their own systems. We make no assumptions about who uses the tool or what the numbers represent.

## Core Principles

1. **Tool, Not Service**: We provide a structured template; subscribers decide how to use it
2. **Identity-Agnostic**: In-app profiles are labels, not verified identities
3. **Content, Not Data Subjects**: Profile data is user-generated content owned by the subscriber
4. **Honor System**: No verification of who clicks buttons or completes actions
5. **Value-Neutral**: Numbers could represent dollars, hearts, points, or peanuts

## Functional Requirements

### FR-001: Subscriber Account Management

**Priority**: P0  
**Category**: Core Business Model

#### FR-001.1: Subscriber Registration

- **Requirement**: System shall allow users to create subscription accounts
- **Acceptance Criteria**:
  - Email/password or OAuth registration
  - Terms of service acceptance (includes age requirements)
  - Payment method required for paid plans
  - Email verification for account security
- **Discussion Point**: Age declaration - is explicit "18+" checkbox needed for SaaS?
- **NOT Required**: Family structure, number of children, parental status
- **Business Value**: Revenue generation and access control

#### FR-001.2: Subscription Management

- **Requirement**: Subscribers shall manage their subscription and billing
- **Acceptance Criteria**:
  - View current plan and usage
  - Upgrade/downgrade plans (Free/Basic/Premium tiers)
  - Update payment methods
  - Cancel subscription
  - Download invoices
  - See tier limits and upgrade prompts
- **Tiers**: See [subscription-tiers.md](./subscription-tiers.md)
- **Business Value**: Customer self-service and retention

### FR-002: Household Profile Management

**Priority**: P0  
**Category**: Core Functionality

#### FR-002.1: Member Creation

- **Requirement**: Subscribers shall create member profiles for their household
- **Acceptance Criteria**:
  - Create members with nicknames (Dragon, Bunny, Mom, Sir Lancelot, etc.)
  - Select from avatar library (tier-dependent: Free=5, Basic=20+, Premium=custom)
  - Optional: Assign a fun sound
  - Optional: Assign sort order (1, 2, 3, etc.) for display ordering
  - No identity verification required
  - No age or birthdate information collected
  - Unlimited creativity in naming
- **Tier Limits**: Free=1 member, Basic=5 members, Premium=unlimited
- **Philosophy**: Like creating characters in a game or roleplay
- **Business Value**: Household organization flexibility

#### FR-002.2: Member Management

- **Requirement**: Subscribers shall manage household members
- **Acceptance Criteria**:
  - Edit member names and avatars
  - Soft delete members (preserve history)
  - Reorder member display (using sort order)
  - No "roles" or "permissions" per member
- **Business Value**: Household flexibility

### FR-003: Task Definition System

**Priority**: P0  
**Category**: Core Value Proposition

#### FR-003.1: Task Creation

- **Requirement**: System shall allow creation of household tasks
- **Acceptance Criteria**:
  - Task title (required, e.g., "Feed the fish")
  - Task description (optional)
  - Value assignment (any number)
  - Icon selection for visual appeal (tier-dependent)
  - Active/inactive toggle
- **Tier Limits**: Free=3 tasks, Basic/Premium=unlimited
- **Philosophy**: Like rows in a spreadsheet
- **Business Value**: Structured responsibility tracking

#### FR-003.2: Task Templates (Future/Low Priority)

- **Status**: PARKED - Not in V1
- **Requirement**: System may provide common task templates
- **Rationale**: Focus on core task creation first
- **Business Value**: Quick setup for new subscribers

### FR-004: Activity Recording System

**Priority**: P0  
**Category**: Core Interaction Model

#### FR-004.1: Task Completion Recording

- **Requirement**: System shall allow recording task completions
- **Acceptance Criteria**:
  - Select a member and mark task complete
  - Timestamp automatically recorded
  - Optional: Photo attachment (Premium tier only)
  - Audio/visual feedback for fun
  - No identity verification of who clicked
- **Philosophy**: Honor system - anyone can record completions
- **Business Value**: Engagement and tracking

#### FR-004.2: Completion Review System

- **Requirement**: System shall allow review of recorded completions
- **Acceptance Criteria**:
  - View all pending completions
  - Approve or reject with reason
  - Bulk operations for efficiency
  - History of decisions
- **Philosophy**: Household decides their own review process
- **Business Value**: Accountability structure

### FR-005: Value Tracking System

**Priority**: P0  
**Category**: Motivation and Rewards

#### FR-005.1: Member Accounts

- **Requirement**: Each member shall have a value tracking account
- **Acceptance Criteria**:
  - Automatic account per member
  - Track balance of accumulated values
  - Support any numeric value
  - Custom value display (Premium: ❤️, ⭐, 🪙, custom text)
  - User-definable value units (not limited dropdown)
- **Philosophy**: Could track dollars, points, hearts, or any unit
- **Business Value**: Motivation and progress visualization

#### FR-005.2: Value Transactions

- **Requirement**: System shall record value changes
- **Acceptance Criteria**:
  - Automatic deposits from approved tasks
  - Manual deposits/withdrawals
  - Transaction descriptions
  - Complete history
- **Philosophy**: Household decides what values mean
- **Business Value**: Flexible reward system

### FR-006: Access Control

**Priority**: P0  
**Category**: Household Privacy

#### FR-006.1: PIN-Based Mode Switching

- **Requirement**: System shall provide PIN-protected administrative mode
- **Acceptance Criteria**:
  - Single PIN for manager access
  - Toggle between "Manager Mode" and "Member Mode"
  - Manager Mode: Full administrative access
  - Member Mode: Simplified interface for task completion
  - No user authentication within household
- **Philosophy**: Like admin controls on shared software
- **Business Value**: Household control without complexity

### FR-007: Language Neutrality

**Priority**: P0  
**Category**: Universal Usability

#### FR-007.1: Role-Neutral Language

- **Requirement**: System shall use neutral language avoiding family-specific terms
- **Acceptance Criteria**:
  - No use of: parent, child, children, kids, family (in UI)
  - Use instead: manager, member, profiles, household, team
  - Mode names: "Manager Mode" not "Parent Mode"
  - Menu items: "Members" not "Family"
  - All UI text must work for diverse use cases
- **Philosophy**: A tool for any group, not just families
- **Business Value**: Broader market appeal and compliance

### FR-008: Terminology Customization (Premium)

**Priority**: P1  
**Category**: Premium Feature  
**Tier**: Premium only

#### FR-008.1: Customizable System Terms

- **Requirement**: Premium subscribers shall customize all system terminology
- **Acceptance Criteria**:
  - Settings page with terminology editor
  - Change any system term (Account, Tasks, Members, etc.)
  - Changes apply instantly across interface
  - Reset to defaults option
  - Export/import terminology sets
- **Examples**:
  - "Account" → "Piggy Bank", "Vault", "Treasury"
  - "Tasks" → "Chores", "Quests", "Missions"
  - "Members" → "Knights", "Players", "Crew"
  - "Values" → "Coins", "Points", "Gold"
- **Business Value**: Power user differentiation, diverse use cases

### FR-009: Backup and Recovery

**Priority**: P0  
**Category**: Data Protection

#### FR-009.1: Automatic Backups

- **Requirement**: System shall automatically backup all household data
- **Acceptance Criteria**:
  - Automatic daily backups (all tiers)
  - Basic tier: 5-day retention
  - Premium tier: 30-day retention
  - Free tier: No user-accessible restore
  - Disaster recovery capabilities
- **Business Value**: Data security and user confidence

#### FR-009.2: Point-in-Time Recovery

- **Requirement**: Paid tiers shall offer backup restoration
- **Acceptance Criteria**:
  - Basic: Restore from last 5 days
  - Premium: Restore from last 30 days
  - One-click restore process
  - Preview before restore
- **Business Value**: Premium feature differentiation

### FR-010: Reporting (Premium)

**Priority**: P2  
**Category**: Premium Feature  
**Tier**: Premium only

#### FR-010.1: PDF Reports

- **Requirement**: Premium subscribers shall generate reports
- **Acceptance Criteria**:
  - Transaction history by member
  - Task completion analytics
  - Monthly/yearly summaries
  - Export as PDF
  - Custom date ranges
- **Report Types**:
  - Member activity reports
  - Task completion trends
  - Value distribution charts
  - Household statistics
- **Business Value**: Premium differentiation, household insights

## Non-Functional Requirements

### NFR-001: Simplicity and Accessibility

**Priority**: P0  
**Category**: User Experience

#### NFR-001.1: Kiosk-Style Interface

- **Requirement**: System shall function without login for household members
- **Acceptance Criteria**:
  - No authentication required after subscriber login
  - Large, touch-friendly interface
  - Works on shared devices
  - Simple enough for all ages to use
- **Business Value**: Household adoption

### NFR-002: Multi-Tenant Architecture

**Priority**: P0  
**Category**: Technical Foundation

#### NFR-002.1: Household Isolation

- **Requirement**: Each subscription shall be completely isolated
- **Acceptance Criteria**:
  - No data leakage between households
  - Separate value tracking per household
  - Independent member management
- **Business Value**: Privacy and scalability

## Compliance Requirements

### CR-001: Subscriber Data Protection

**Priority**: P0  
**Category**: Legal Compliance

#### CR-001.1: GDPR Compliance for Subscribers

- **Requirement**: System shall protect subscriber (account holder) data
- **Acceptance Criteria**:
  - Right to access subscriber data
  - Right to delete entire household
  - Right to data portability
  - Clear privacy policy
- **Scope**: Only applies to subscriber account, not household members
- **Business Value**: Legal compliance

#### CR-001.2: User-Generated Content

- **Requirement**: System shall treat ALL household data as user-generated content
- **Acceptance Criteria**:
  - Subscriber owns all data: members, tasks, values, etc.
  - Member profiles are UGC (no identity verification)
  - Tasks and task values are UGC
  - Value units/symbols are UGC
  - Custom terminology is UGC
  - Clear terms of service
- **Philosophy**: Like documents in OneDrive - we provide the tool, they create the content
- **Business Value**: Simplified compliance

### CR-002: Honest Marketing

**Priority**: P0  
**Category**: Regulatory Compliance

#### CR-002.1: Accurate Service Description

- **Requirement**: Marketing shall accurately describe the service
- **Acceptance Criteria**:
  - Describe as "household management tool"
  - Don't claim to be a "children's app"
  - Show diverse use cases
  - Clear about subscriber responsibility
- **Business Value**: Avoid misleading claims

## Simplified Data Model

### Core Entities

1. **Subscriber Account**

   - Email (for login/billing)
   - Subscription status
   - Payment information
   - Settings (PIN, language, theme)

2. **Household Members** (User-Generated Content)

   - Nickname (any creative name)
   - Avatar selection
   - Optional: Fun sound
   - Optional: Sort order (for display)
   - Account balance (value tracking)

3. **Tasks** (User-Generated Content)

   - Title and description
   - Assigned value
   - Icon
   - Active status

4. **Activity Records** (User-Generated Content)
   - Which member completed which task
   - When it was recorded
   - Approval status
   - Value transactions
   - Optional: Photo proof (Premium)

### What We DON'T Track

- Real names of household members
- Ages of household members
- Relationships between members
- Whether members represent real people
- What the values represent (currency or otherwise)

## Migration Requirements

### MR-001: Simplified Migration

**Priority**: P0  
**Category**: User Transition

#### MR-001.1: Docker User Migration

- **Requirement**: System shall migrate existing Docker deployments
- **Acceptance Criteria**:
  - One subscriber account per Docker instance
  - All existing members migrate as-is
  - No identity mapping required
  - Grandfathered pricing honored
- **Business Value**: User retention

## Key Simplifications from v1

### Removed Concepts

1. ~~Parent/child account relationships~~
2. ~~Age verification for members~~
3. ~~Family member invitations~~
4. ~~Role-based permissions per member~~
5. ~~Parental consent workflows~~
6. ~~Real identity verification~~

### Simplified Concepts

1. **Authentication**: Only for subscriber account
2. **Members**: Just labels and avatars
3. **Compliance**: Focus on subscriber data only
4. **Marketing**: Position as household tool, not children's app

## Success Metrics

### Business Metrics

- Subscriber acquisition rate
- Subscription conversion rate
- Household engagement (members created, tasks completed)
- Subscriber retention

### NOT Tracking

- Ages of users
- Family structures
- Real vs. fictional members
- Actual monetary values

## Implementation Guidelines

### Language Guidelines

#### Always Use

- "Manager" not "parent"
- "Member" not "child"
- "Members" not "children" or "kids"
- "Household" or "Team" not "family"
- "Tasks" or "Activities" not "chores"
- "Values" not "allowance" or "money"
- "Account" not "piggy bank" (but customizable in Premium)
- "Manager Mode" not "parent mode"
- "Member Mode" not "child mode"

#### Menu and Navigation

- "Members" not "Family" (menu item)
- "Member Management" not "Family Management"
- "Add Member" not "Add Family Member"

#### Settings and Features

- "Enable access modes" not "Enforce parent/child roles"
- "Manager PIN" not "Parent PIN"
- "Access controls" not "Parental controls"

### Interface Design

- Don't ask for ages or birthdates
- Don't imply family relationships
- Don't assume currency
- Keep it playful and flexible
- Ensure language works for all use cases (medieval, gaming, roommates, etc.)
- Allow terminology customization (Premium feature)
- Use neutral defaults that can be customized

---

## Document Control

**Major Changes in v2.0**:

- Reframed as household tool vs children's app
- Removed complex identity management
- Simplified compliance approach
- Clarified subscriber vs member distinction
- Adopted content vs data subject model

**Updates in v2.1** (2025-07-09):

- Added three-tier subscription model (Free/Basic/Premium)
- Introduced terminology customization (Premium feature)
- Changed "profiles" to "members" throughout
- Changed "birth order" to "sort order"
- Clarified ALL content is user-generated (not just members)
- Added backup/restore requirements (tier-based)
- Added PDF reporting feature (Premium)
- Removed task templates (parked for future)
- Made age declaration a discussion point
- Specified tier-based limits (members, tasks, icons)
- Clarified PIN is for manager access, not household

**Philosophy**: We provide the tool; households decide how to use it.
