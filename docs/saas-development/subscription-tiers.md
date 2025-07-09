# Subscription Tiers - Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-09  
**Status**: Draft  
**Project**: Taschengeld SaaS Transformation

## Overview

This document defines the three-tier subscription model for Taschengeld SaaS, outlining features and limitations for each tier to drive conversion while providing value at every level.

## Tier Structure

### 🆓 Free Tier - "Try It Out"
**Price**: $0/month  
**Purpose**: Let users experience the core functionality  

**Limits**:
- **1 household member** (single user account)
- **3 tasks maximum**
- **Basic icons only** (5 icons)
- **No photo attachments**
- **No custom value symbols** 
- **No data export/reporting**
- **No backup restoration** (platform handles backups invisibly)
- **Standard support** (community/FAQ only)

**Features Included**:
- Core task tracking
- Value/reward tracking
- PIN-based mode switching
- Basic icon set
- All core functionality

### 💎 Basic Tier - "Family Essential"
**Price**: $4.99/month  
**Purpose**: Full functionality for typical households  

**Limits**:
- **5 household members** (user accounts)
- **Unlimited tasks**
- **Expanded icon library** (20+ icons)
- **5-day backup history** (restore points)
- **Email support**

**Features Included**:
- Everything in Free tier
- Unlimited task creation
- Larger icon selection
- Basic backup restoration (last 5 days)
- Email support

### 👑 Premium Tier - "Power Household"
**Price**: $9.99/month  
**Purpose**: Advanced features for larger/complex households  

**Limits**:
- **Unlimited household members**
- **Unlimited everything**

**Premium Features**:
- Everything in Basic tier
- **Photo attachments** for task completions
- **Custom value symbols** (❤️, ⭐, 🪙, or any emoji/text)
- **Custom icons** (upload your own)
- **Customizable terminology** (rename system terms)
- **Advanced reporting** (PDF exports)
- **30-day backup history**
- **Priority support**
- **API access** (future)
- **Advanced analytics** (future)

## Feature Comparison Table

| Feature | Free | Basic | Premium |
|---------|------|-------|---------|
| **Household Members** | 1 | 5 | Unlimited |
| **Tasks** | 3 | Unlimited | Unlimited |
| **Icons** | 5 basic | 20+ | Custom uploads |
| **Photo Attachments** | ❌ | ❌ | ✅ |
| **Custom Value Symbols** | ❌ | ❌ | ✅ |
| **Terminology Customization** | ❌ | ❌ | ✅ |
| **Backup History** | Auto only | 5 days | 30 days |
| **Reporting/Export** | ❌ | ❌ | PDF reports |
| **Support** | FAQ | Email | Priority |

## Terminology Customization (Premium)

Premium subscribers can customize all system terminology:

### Examples of Customizable Terms
- "Account" → "Piggy Bank", "Vault", "Treasury", "Wallet"
- "Tasks" → "Chores", "Quests", "Missions", "Responsibilities"  
- "Members" → "Knights", "Players", "Team", "Crew"
- "Manager Mode" → "Admin Mode", "Parent Mode", "DM Mode"
- "Values" → "Coins", "Points", "Gold", "Credits"
- "Household" → "Kingdom", "Guild", "Team", "Family"

### Implementation
- Settings page with terminology editor
- Changes apply instantly across the interface
- Export/import terminology sets
- Pre-built terminology packs (Medieval, Gaming, Corporate, etc.)

## Migration & Grandfathering

### Docker Users Migration
- All existing Docker users get **Basic tier free for 6 months**
- After 6 months: Special rate of $2.99/month (40% discount forever)
- Unlimited data import from Docker export

### Early Adopter Benefits
- First 1000 subscribers: 50% off for life
- Beta testers: Premium features at Basic price

## Future Tier Considerations

### Potential Add-ons (Not in V1)
- Additional member packs (+$1/month per 5 members)
- White-label option for organizations
- Educational institution pricing
- Non-profit discounts

### Potential Premium Features (Phase 2)
- Mobile app priority access
- 2FA/advanced security
- Multiple households per account
- Household templates marketplace
- Integration with allowance cards
- Automated allowance disbursement

## Conversion Strategy

### Free → Basic Triggers
- Hit 1 member limit
- Hit 3 task limit
- Want more icons
- Need backup/restore

### Basic → Premium Triggers
- Hit 5 member limit
- Want photo proof of tasks
- Need custom symbols/icons
- Want reporting capabilities
- Need to rebrand terminology

## Technical Implementation

### Enforcement Points
```typescript
interface SubscriptionLimits {
  maxMembers: number | 'unlimited';
  maxTasks: number | 'unlimited';
  maxIcons: number;
  features: {
    photoAttachments: boolean;
    customSymbols: boolean;
    customTerminology: boolean;
    reporting: boolean;
    backupDays: number;
  };
}

const TIER_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    maxMembers: 1,
    maxTasks: 3,
    maxIcons: 5,
    features: {
      photoAttachments: false,
      customSymbols: false,
      customTerminology: false,
      reporting: false,
      backupDays: 0
    }
  },
  basic: {
    maxMembers: 5,
    maxTasks: 'unlimited',
    maxIcons: 20,
    features: {
      photoAttachments: false,
      customSymbols: false,
      customTerminology: false,
      reporting: false,
      backupDays: 5
    }
  },
  premium: {
    maxMembers: 'unlimited',
    maxTasks: 'unlimited',
    maxIcons: 'unlimited',
    features: {
      photoAttachments: true,
      customSymbols: true,
      customTerminology: true,
      reporting: true,
      backupDays: 30
    }
  }
};
```

### Grace Periods
- Downgrade: 30-day grace period to reduce members/tasks
- Payment failure: 7-day grace period before account suspension
- Cancellation: Data retained for 90 days

## Revenue Projections

Based on typical SaaS conversion rates:
- 60% stay on free tier
- 30% convert to basic ($4.99)
- 10% convert to premium ($9.99)

**Per 1000 users**:
- 600 free × $0 = $0
- 300 basic × $4.99 = $1,497
- 100 premium × $9.99 = $999
- **Total MRR**: $2,496

## Key Decisions

1. **No per-member pricing**: Simpler than $2/member model
2. **Generous free tier**: 1 member + 3 tasks is enough to test
3. **Clear upgrade paths**: Hit limits naturally through usage
4. **Premium terminology**: Major differentiator for power users
5. **Backup as invisible feature**: Users expect it, not a selling point

---

**Next Steps**:
1. Update requirements specification with tier information
2. Design upgrade/downgrade flows
3. Create pricing page mockups
4. Define grace period behaviors