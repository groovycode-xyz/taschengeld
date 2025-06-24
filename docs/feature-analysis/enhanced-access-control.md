# Enhanced Access Control Feature Analysis

## Overview

This document outlines planned enhancements to Taschengeld's IAM (Identity and Access Management) model based on family use case analysis and design philosophy clarification.

## Current IAM Model Understanding

### Design Philosophy
- **Kiosk-style operation** - Family-friendly, easy access
- **UI-based access control** - Not enterprise authentication/authorization
- **Family trust model** - Designed for home network, not malicious users
- **Child-friendly design** - Minimal barriers to access
- **Protection against accidents** - Not security threats

### Current Implementation
- **Parent/Child Mode**: UI state toggle controlling visibility and navigation
- **PIN Protection**: Optional simple prompt-based mode switching
- **Settings Access**: Gated only when both `enforce_roles=true` AND PIN is set
- **Plain Text Storage**: PINs stored as plain text (appropriate for family context)

## Planned Enhancements

### 1. Session Persistence
**Current**: Mode state may not persist across browser sessions
**Enhancement**: 
- Persist Parent/Child mode across browser sessions
- Store mode state in secure cookies or localStorage
- Default to Child Mode on first visit if roles are enforced

### 2. Admin Failsafe/Backdoor
**Requirement**: Docker admin should be able to reset PIN without UI access
**Proposed Solutions**:
- Environment variable override: `ADMIN_RESET_PIN=true`
- Docker volume mount for reset flag file
- Console command in docker-entrypoint.sh
- Database direct manipulation documentation

### 3. Multi-Device Policy Management ⭐ **Key Innovation**
**Problem**: Different family members need different access policies per device
**Use Cases**:
- 12-year-old: No restrictions on personal iPad
- 5-year-old: Child mode enforced on family iPad  
- Sneaky kid: PIN required on their device to prevent self-approving tasks
- Parent: Wants global control option across all devices

**Proposed Solution**: Device-Based vs Global Access Policies

#### Option A: Device Registration
```
Global Settings → Access Control → Device Management
├── Device-based policies (default)
│   ├── Register new device with policy
│   ├── Per-device PIN requirements
│   └── Per-device mode defaults
└── Global policy override
    ├── Enforce same policy across all devices
    └── Override all device-specific settings
```

#### Option B: User Agent / Device Fingerprinting
```
Access Control Settings:
├── Policy Mode: [Device-specific] [Global]
├── Device-specific configuration:
│   ├── Auto-detect new devices
│   ├── Assign default policy to new devices
│   └── Manual device policy override
└── Global policy configuration:
    ├── Same PIN requirement for all
    └── Same mode restrictions for all
```

### 4. Codebase Cleanup
**Areas requiring attention**:
- Remove any remaining server-side authorization patterns
- Ensure UI access control consistency
- Verify navigation/routing aligns with mode switching
- Clean up PIN validation logic
- Remove over-engineered security remnants

## Implementation Plan

### Phase 1: Foundation (Post-Compact Event)
1. **Audit current IAM implementation**
   - Map all mode-checking code
   - Identify inconsistencies
   - Document current behavior

2. **Session persistence**
   - Implement secure mode state storage
   - Add proper session management
   - Test across browser restarts

3. **Admin failsafe**
   - Design Docker-level PIN reset mechanism
   - Document admin procedures
   - Test emergency access scenarios

### Phase 2: Multi-Device Enhancement
1. **Device detection/registration**
   - Implement device fingerprinting or registration
   - Design device management UI
   - Create device policy data model

2. **Policy engine**
   - Build device-specific vs global policy logic
   - Implement policy inheritance and overrides
   - Add policy management interface

3. **Testing and refinement**
   - Test with multiple browsers/devices
   - Verify family use case scenarios
   - Polish UX for non-technical family members

### Phase 3: Polish and Documentation
1. **User documentation updates**
2. **Admin/parent setup guides**
3. **Performance optimization**
4. **Final testing and validation**

## Success Criteria

### Functional Requirements
- ✅ Parent/Child mode persists across sessions
- ✅ Admin can reset PIN without UI access
- ✅ Different devices can have different access policies
- ✅ Global policy override works correctly
- ✅ No server-side authorization remnants
- ✅ UI consistently respects mode settings

### Family Usability
- ✅ Easy for parents to configure per-child/device needs
- ✅ Intuitive for children to use their assigned devices
- ✅ Minimal complexity for common use cases
- ✅ Clear visual feedback for current mode/restrictions

### Technical Quality
- ✅ Clean, maintainable code
- ✅ Consistent design patterns
- ✅ Good error handling and edge cases
- ✅ Performance impact minimal
- ✅ Documentation complete and accurate

## Risk Mitigation

### Complexity Creep
- Keep device detection simple (user agent + localStorage)
- Limit policy options to essential use cases
- Maintain fallback to current simple model

### Family Confusion
- Provide clear setup wizard for device policies
- Default to current behavior (global policy)
- Add contextual help and tooltips

### Technical Issues
- Thorough testing with multiple browsers
- Graceful degradation if device detection fails
- Clear error messages and recovery options

---

**Branch**: `feature/enhanced-access-control`
**Target Release**: Post-Compact Event
**Complexity**: Medium (new feature + cleanup)
**Risk**: Low (enhances existing model, doesn't replace)