# Simplified Data Model - Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-09  
**Philosophy**: Household Management Tool

## Overview

This document presents the simplified data model based on our core principle: Taschengeld is a tool for household management, not a service for managing children. The subscriber owns all data, and profiles are user-generated content.

## Core Data Model

### 1. Subscriber Level (Real Identity)

```sql
-- The paying customer (adult who subscribes)
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT now(),
    last_login_at TIMESTAMP,
    
    -- OAuth providers
    google_id VARCHAR(255) UNIQUE,
    apple_id VARCHAR(255) UNIQUE,
    
    -- Subscription info
    stripe_customer_id VARCHAR(255) UNIQUE,
    subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, past_due, canceled
    subscription_plan VARCHAR(50) DEFAULT 'free', -- free, basic, premium
    subscription_end_date TIMESTAMP,
    
    -- Household settings
    household_name VARCHAR(255), -- "The Smith Family", "Dragons Den", etc.
    pin_hash VARCHAR(255), -- For mode switching
    locale VARCHAR(10) DEFAULT 'en', -- en, de
    theme VARCHAR(20) DEFAULT 'light', -- light, dark
    currency_display VARCHAR(10) DEFAULT '$', -- $, €, ❤️, 🌟, etc.
    
    CONSTRAINT age_declaration CHECK (email_verified = true) -- Implies 18+ declaration
);

-- Audit trail for compliance
CREATE TABLE subscriber_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- login, logout, subscription_change, data_export
    event_data JSONB,
    ip_address_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT now()
);
```

### 2. Household Content Level (User-Generated Content)

```sql
-- Household member profiles (like game characters)
CREATE TABLE household_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    nickname VARCHAR(100) NOT NULL, -- "Dragon", "Bunny", "Sir Lancelot", "Lady Guinevere"
    avatar_id VARCHAR(50) NOT NULL, -- Pre-approved avatar library
    sound_id VARCHAR(50), -- Optional fun sound
    birth_order INTEGER, -- Optional: 1st, 2nd, 3rd for sorting (NOT age!)
    value_balance DECIMAL(15, 2) DEFAULT 0, -- Their "piggy bank"
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    
    -- No age, no birthdate, no real name, no identity verification
    -- Birth order is just a sorting preference, not PII
    CONSTRAINT unique_nickname_per_household UNIQUE (subscriber_id, nickname)
);

-- Tasks defined by the household
CREATE TABLE household_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL, -- "Feed the fish", "Dragon homework"
    description TEXT,
    icon_id VARCHAR(50) NOT NULL,
    value_amount DECIMAL(15, 2) NOT NULL, -- Could be 1.00 or 1000000.00
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

-- Activity records (who did what)
CREATE TABLE activity_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES household_profiles(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES household_tasks(id) ON DELETE CASCADE,
    
    -- Recording
    recorded_at TIMESTAMP DEFAULT now(),
    recorded_value DECIMAL(15, 2) NOT NULL, -- Task value at time of completion
    photo_url VARCHAR(500), -- Premium feature
    
    -- Review
    review_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    reviewed_at TIMESTAMP,
    review_note TEXT,
    
    -- Value tracking
    transaction_id UUID -- Links to value transaction if approved
);

-- Value transactions (the "piggy bank" ledger)
CREATE TABLE value_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES household_profiles(id) ON DELETE CASCADE,
    
    transaction_type VARCHAR(20) NOT NULL, -- task_reward, manual_deposit, manual_withdraw
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description TEXT,
    
    -- Link to activity if applicable
    activity_record_id UUID REFERENCES activity_records(id),
    
    created_at TIMESTAMP DEFAULT now()
);
```

### 3. System Level

```sql
-- Pre-defined content libraries
CREATE TABLE avatar_library (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50), -- animals, fantasy, professions, etc.
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE icon_library (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50), -- household, outdoor, school, etc.
    svg_path TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE sound_library (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50), -- fun, animals, celebration, etc.
    audio_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200),
    description TEXT,
    icon_id VARCHAR(50),
    suggested_value DECIMAL(15, 2),
    category VARCHAR(50),
    locale VARCHAR(10) -- Language-specific templates
);
```

## Key Design Decisions

### What We Track

1. **Subscriber Level**: 
   - Email and authentication (real identity)
   - Subscription and billing
   - Household settings
   - Audit trail for compliance

2. **Content Level**:
   - Creative nicknames and avatars
   - Task definitions
   - Activity records
   - Value balances and history

### What We DON'T Track

1. **No Real Identities for Profiles**:
   - No real names required
   - No age information
   - No identity verification
   - No relationship mapping

2. **No Assumptions**:
   - No currency enforcement
   - No age-based restrictions
   - No family structure validation
   - No behavioral tracking

### Privacy by Design

1. **Subscriber Data** (Protected):
   - Email and authentication
   - Payment information
   - IP addresses (hashed)
   - Login activity

2. **Household Content** (User-Generated):
   - Owned by subscriber
   - No PII requirements
   - Exportable/deletable as a unit
   - No individual privacy rights

## Migration from Complex Model

### Removed Tables
- ~~`user_accounts`~~ - No separate family member accounts
- ~~`family_memberships`~~ - No complex relationships
- ~~`parental_consent`~~ - Not needed
- ~~`age_verification`~~ - Not collected

### Simplified Tables
- `users` → `household_profiles` (just creative profiles)
- `tenants` → `subscribers` (the paying customer)
- Complex permissions → Simple PIN for mode switching

## API Implications

### Simplified Endpoints

```typescript
// Subscriber Management (Real Identity)
POST   /api/auth/register     // Adult creates account
POST   /api/auth/login        // Subscriber login
GET    /api/subscriber/profile // Get subscriber info
PUT    /api/subscriber/settings // Update household settings

// Household Management (User Content)  
GET    /api/household/profiles // List all profiles
POST   /api/household/profiles // Create "Dragon" profile
PUT    /api/household/profiles/:id // Update profile
DELETE /api/household/profiles/:id // Soft delete

// Task Management
GET    /api/household/tasks    // List all tasks
POST   /api/household/tasks    // Create new task
PUT    /api/household/tasks/:id // Update task

// Activity Recording (No Auth Required in Household)
POST   /api/activities/record  // Record task completion
GET    /api/activities/pending // Get pending reviews
POST   /api/activities/review  // Approve/reject activities

// Value Tracking
GET    /api/values/balances    // All profile balances
GET    /api/values/history/:profileId // Transaction history
POST   /api/values/manual      // Manual deposit/withdraw
```

### No Complex Permissions

- All household members can view everything
- PIN mode just enables administrative functions
- No per-profile permissions
- No age-based restrictions

## Benefits of This Model

1. **Simplicity**: 
   - Fewer tables and relationships
   - Clearer mental model
   - Easier to explain to users

2. **Privacy**: 
   - Only subscriber is identifiable
   - Profiles are just labels
   - Reduced compliance burden

3. **Flexibility**: 
   - Households can organize however they want
   - No forced structure
   - Creative freedom

4. **Honesty**: 
   - We don't pretend to know who's using it
   - We don't make assumptions
   - We provide tools, not rules

## Conclusion

This simplified data model reflects our core philosophy: Taschengeld is a household management tool that subscribers can use however they wish. We protect subscriber data while treating household profiles as creative content owned by the subscriber.

The model is:
- **Legally compliant** without complexity
- **Flexible** for diverse household structures  
- **Honest** about what we do and don't know
- **Simple** to implement and maintain