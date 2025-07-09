# Language Neutralization Guide - From Family App to Household Tool

**Document Version**: 1.0  
**Date**: 2025-07-09  
**Purpose**: Systematic replacement of family-specific language with neutral terminology

## Core Principle

Remove all language that implies family relationships, ages, or parent-child dynamics. Replace with functional, role-neutral terms that work for any use case.

## Terminology Replacements

### Mode Switching

**Current → Recommended**

| Current Term | Recommended | Alternative Options | Rationale |
|-------------|-------------|-------------------|-----------|
| Parent Mode | Manager Mode | Admin Mode, Full Mode, Control Mode | Functional role, not relationship |
| Child Mode | Member Mode | Simple Mode, Basic Mode, Task Mode | Participant role, not age |
| Switch to Parent Mode | Switch to Manager Mode | Enter Admin View, Full Access | Clear function |
| Switch to Child Mode | Switch to Member Mode | Simple View, Basic Access | Clear limitation |

### Menu and Navigation

| Current Term | Recommended | Alternative Options | Rationale |
|-------------|-------------|-------------------|-----------|
| Family | Members | Profiles, Team, Household, Users | Generic group term |
| Family Management | Member Management | Profile Management, Team Setup | Neutral management |
| Add Family Member | Add Member | Create Profile, Add User | No relationship implied |

### Settings and Configuration

| Current Term | Recommended | Alternative Options | Rationale |
|-------------|-------------|-------------------|-----------|
| Enforce parent/child roles | Enable access modes | Enable role separation, Use access controls | Functional description |
| Parent PIN | Manager PIN | Admin PIN, Access PIN | Security function |
| Child-safe mode | Simple interface mode | Basic view, Limited access | Feature description |
| Parental controls | Access controls | Manager settings, Admin controls | Generic control |

### User Interface Elements

| Current Term | Recommended | Alternative Options | Rationale |
|-------------|-------------|-------------------|-----------|
| Your children | Team members | Your profiles, Household members | Neutral collective |
| Select child | Select member | Choose profile, Select user | Action-focused |
| Child's balance | Member balance | Profile balance, Account balance | Ownership neutral |
| Parent approval | Manager approval | Approval required, Admin review | Process-focused |

### Task-Related Language

| Current Term | Recommended | Alternative Options | Rationale |
|-------------|-------------|-------------------|-----------|
| Chores | Tasks | Activities, Quests, Missions | More versatile |
| Allowance | Rewards | Earnings, Points, Values | Value-neutral |
| Payday | Payout | Review day, Settlement, Processing | Process-focused |
| Did your chores? | Tasks complete? | Activities done?, Missions accomplished? | Broader application |

### Onboarding and Help Text

| Current Term | Recommended | Alternative Options | Rationale |
|-------------|-------------|-------------------|-----------|
| Set up your family | Set up your household | Create your team, Start your group | Inclusive setup |
| Add your children | Add members | Create profiles, Add team members | No assumption |
| Teach kids responsibility | Track achievements | Manage tasks, Organize activities | Broader purpose |
| For parents | For managers | For administrators, For organizers | Role-based |

## Implementation Examples

### Before (Family-Focused)
```
Welcome to Taschengeld!
Set up your family and start teaching your children about money and responsibility.

1. Create parent account
2. Add your children
3. Set up chores and allowances
4. Switch to child mode for kids to use
```

### After (Tool-Focused)
```
Welcome to Taschengeld!
Set up your household and start tracking tasks and rewards your way.

1. Create your account
2. Add member profiles
3. Set up tasks and values
4. Switch to member mode for simple access
```

### Settings Screen Example

**Before:**
```
□ Enforce parent/child roles
□ Require PIN for parent mode
□ Show child-friendly animations
□ Enable parental notifications
```

**After:**
```
□ Enable access modes
□ Require PIN for manager mode
□ Show fun animations
□ Enable admin notifications
```

### Mode Switch Button

**Before:**
```html
<button>
  <Icon name="baby" />
  Switch to Child Mode
</button>
```

**After:**
```html
<button>
  <Icon name="users" />
  Switch to Member Mode
</button>
```

## Code Search Patterns

### Terms to Search and Replace

**High Priority (User-Facing)**:
- `/parent/gi` → Check context, replace with "manager" or "admin"
- `/child/gi` → Check context, replace with "member" or "profile"
- `/family/gi` → Replace with "household" or "team"
- `/allowance/gi` → Replace with "rewards" or "values"
- `/chore/gi` → Replace with "task" or "activity"

**Code Variables (Internal)**:
- `parentMode` → `managerMode` or `adminMode`
- `childMode` → `memberMode` or `simpleMode`
- `isParent` → `isManager` or `hasAdminAccess`
- `childUsers` → `memberProfiles` or `householdMembers`

**Database/API (May need migration)**:
- `parent_id` → `manager_id` or `admin_id`
- `child_id` → `member_id` or `profile_id`
- `family_id` → `household_id` or `group_id`

## Component-Specific Updates

### Navigation Component
```typescript
// Before
const menuItems = [
  { label: 'Family', icon: 'users', path: '/family' },
  { label: 'Chores', icon: 'list', path: '/chores' },
  { label: 'Allowance', icon: 'dollar', path: '/allowance' }
];

// After
const menuItems = [
  { label: 'Members', icon: 'users', path: '/members' },
  { label: 'Tasks', icon: 'list', path: '/tasks' },
  { label: 'Rewards', icon: 'star', path: '/rewards' }
];
```

### Mode Toggle Component
```typescript
// Before
<ModeToggle 
  parentLabel="Parent Mode"
  childLabel="Child Mode"
  tooltip="Switch between parent and child views"
/>

// After
<ModeToggle 
  adminLabel="Manager Mode"
  simpleLabel="Member Mode"
  tooltip="Switch between manager and member views"
/>
```

## Marketing and Documentation Updates

### Website Copy
- "Family allowance tracker" → "Household task and reward tracker"
- "Teach your children" → "Track achievements and progress"
- "Parents love..." → "Managers appreciate..."
- "Kids enjoy..." → "Members enjoy..."

### Feature Descriptions
- "Parental controls" → "Access management"
- "Child-safe interface" → "Simplified interface"
- "Family dashboard" → "Household dashboard"
- "Children's progress" → "Member achievements"

## Gradual Rollout Strategy

### Phase 1: Critical UI Elements
1. Mode switching buttons
2. Main navigation menu
3. Onboarding flow
4. Settings page

### Phase 2: Documentation
1. Help text and tooltips
2. Marketing website
3. API documentation
4. User guides

### Phase 3: Internal Code
1. Variable names
2. Function names
3. Database schema (careful migration)
4. API endpoints

## Testing the Changes

### User Acceptance Criteria
- Medieval roleplay scenario works naturally
- Roommate scenario feels appropriate
- Gaming guild usage makes sense
- Traditional family usage still works

### Language Review Checklist
- [ ] No age implications in any text
- [ ] No family relationship assumptions
- [ ] All features described functionally
- [ ] Works for diverse use cases

## Special Considerations

### Keep Some Flexibility
Some compound terms might be okay if they're clearly metaphorical:
- "Household" is okay (doesn't imply family)
- "Team" works for many contexts
- "Group" is very neutral

### Avoid Over-Correction
Don't make it so generic it loses personality:
- Keep fun and playful tone
- Use engaging action words
- Maintain warmth without implying relationships

## Migration Path

### For Existing Docker Users
- Grandfather their terminology preferences
- Provide a "Classic Mode" option initially
- Gradual transition with clear communication

### For New SaaS Users
- Use new terminology from day one
- Show diverse use cases in onboarding
- Let them self-select their context

## Success Metrics

### Quantitative
- % of non-family use cases in registration
- Diversity of profile names created
- Support ticket reduction about "not just for families"

### Qualitative
- User feedback about inclusivity
- Use case variety in reviews
- Natural adoption by non-family groups

---

## Quick Reference Card

**Always Say**:
- Manager/Member (not Parent/Child)
- Household/Team (not Family)
- Tasks/Activities (not Chores)
- Rewards/Values (not Allowance)
- Profiles/Members (not Children)

**Mode Names**:
- Manager Mode / Member Mode
- OR: Admin Mode / Simple Mode
- OR: Full Mode / Basic Mode

**The Test**: 
Would this language work for:
- A medieval kingdom? ✓
- College roommates? ✓
- A gaming guild? ✓
- A classroom? ✓
- A family? ✓

If yes to all, the language is properly neutral!