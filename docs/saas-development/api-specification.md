# API Specification - Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-09  
**Status**: Complete  
**Project**: Taschengeld SaaS Transformation  
**Philosophy**: Household Management Tool

## Executive Summary

This document defines the RESTful API specification for Taschengeld SaaS, a household management tool that allows subscribers to track tasks, activities, and rewards within their household. The API is designed around our core philosophy: we provide the structure, households decide how to use it.

### Key API Principles

1. **Subscriber-Centric**: Only subscribers authenticate; household members are content
2. **Tier-Aware**: Features and limits enforced based on subscription level
3. **Stateless**: All endpoints are stateless and horizontally scalable
4. **Privacy-First**: Minimal data collection, clear ownership model
5. **RESTful**: Standard HTTP verbs and status codes throughout

## Base Configuration

### API Base URL

```
Production:  https://api.taschengeld.com/v1
Staging:     https://api-staging.taschengeld.com/v1
Development: http://localhost:3000/api/v1
```

### Request/Response Format

- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8
- **Date Format**: ISO 8601 (`2025-07-09T10:30:00Z`)
- **Decimal Precision**: 2 decimal places for monetary values

### API Versioning

- **Current Version**: v1
- **Versioning Strategy**: URL path versioning (`/v1/`, `/v2/`)
- **Deprecation Policy**: 12-month notice for breaking changes

## Authentication & Authorization

### Authentication Model

Only **subscribers** authenticate with the API. Household members are user-generated content and do not have individual accounts.

```typescript
interface AuthToken {
  subscriberId: string;
  email: string;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'canceled';
  tierLimits: SubscriptionLimits;
  iat: number;
  exp: number;
}
```

### Authentication Methods

#### 1. Email/Password Authentication

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "subscriber": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "subscriptionPlan": "basic",
      "subscriptionStatus": "active",
      "householdName": "The Smith Family"
    }
  }
}
```

#### 2. OAuth Authentication

```http
GET /auth/oauth/google
GET /auth/oauth/apple
```

#### 3. Magic Link Authentication

```http
POST /auth/magic-link
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Session Management

#### JWT Token Structure

```javascript
// Access Token (15 minutes)
{
  "sub": "subscriber_id",
  "email": "user@example.com",
  "plan": "basic",
  "status": "active",
  "limits": {
    "maxMembers": 5,
    "maxTasks": "unlimited",
    "features": {
      "photoAttachments": false,
      "customSymbols": false,
      "customTerminology": false,
      "reporting": false
    }
  },
  "iat": 1704967800,
  "exp": 1704968700
}

// Refresh Token (30 days)
{
  "sub": "subscriber_id",
  "type": "refresh",
  "iat": 1704967800,
  "exp": 1707559800
}
```

#### Token Refresh

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### PIN-Based Mode Switching

Within a household, users can switch between Manager Mode and Member Mode using a PIN (no individual authentication required).

```http
POST /household/mode/verify
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pin": "1234"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "mode": "manager",
    "sessionId": "session_123456789"
  }
}
```

## Core API Endpoints

### 1. Authentication Endpoints

#### Register New Subscriber

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "householdName": "The Smith Family",
  "locale": "en",
  "agreedToTerms": true
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "subscriberId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "subscriptionPlan": "free",
    "subscriptionStatus": "trial",
    "verificationEmailSent": true
  }
}
```

#### Verify Email Address

```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "email_verification_token_here"
}
```

#### Request Password Reset

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "newsecurepassword123"
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

### 2. Subscriber Management Endpoints

#### Get Subscriber Profile

```http
GET /subscriber/profile
Authorization: Bearer <access_token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "emailVerified": true,
    "householdName": "The Smith Family",
    "subscriptionPlan": "basic",
    "subscriptionStatus": "active",
    "subscriptionEndDate": "2025-08-09T10:30:00Z",
    "locale": "en",
    "theme": "light",
    "currencyDisplay": "$",
    "createdAt": "2025-01-01T00:00:00Z",
    "lastLoginAt": "2025-07-09T10:30:00Z"
  }
}
```

#### Update Subscriber Profile

```http
PUT /subscriber/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "householdName": "The Dragon Family",
  "locale": "de",
  "theme": "dark",
  "currencyDisplay": "€"
}
```

#### Update PIN

```http
PUT /subscriber/pin
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPin": "1234",
  "newPin": "5678"
}
```

#### Get Subscription Status

```http
GET /subscriber/subscription
Authorization: Bearer <access_token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "plan": "basic",
    "status": "active",
    "currentPeriodStart": "2025-07-01T00:00:00Z",
    "currentPeriodEnd": "2025-08-01T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "usage": {
      "members": 3,
      "tasks": 12,
      "activitiesThisMonth": 145
    },
    "limits": {
      "maxMembers": 5,
      "maxTasks": "unlimited",
      "features": {
        "photoAttachments": false,
        "customSymbols": false,
        "customTerminology": false,
        "reporting": false,
        "backupDays": 5
      }
    }
  }
}
```

#### Delete Account

```http
DELETE /subscriber/account
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "confirmation": "DELETE_MY_ACCOUNT",
  "reason": "No longer needed"
}
```

### 3. Household Management Endpoints

#### Get Household Settings

```http
GET /household/settings
Authorization: Bearer <access_token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "householdName": "The Smith Family",
    "locale": "en",
    "theme": "light",
    "currencyDisplay": "$",
    "timezone": "America/New_York",
    "customTerminology": {
      "members": "Knights",
      "tasks": "Quests",
      "values": "Gold",
      "account": "Treasury"
    }
  }
}
```

#### Update Household Settings

```http
PUT /household/settings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "householdName": "The Dragon Kingdom",
  "currencyDisplay": "🪙",
  "customTerminology": {
    "members": "Knights",
    "tasks": "Quests",
    "values": "Gold",
    "account": "Treasury"
  }
}
```

### 4. Profile Management Endpoints

#### List All Profiles

```http
GET /profiles
Authorization: Bearer <access_token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "profile_001",
      "nickname": "Dragon",
      "avatarId": "dragon_001",
      "soundId": "roar_001",
      "birthOrder": 1,
      "valueBalance": 125.5,
      "displayOrder": 1,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": "profile_002",
      "nickname": "Bunny",
      "avatarId": "bunny_001",
      "soundId": "hop_001",
      "birthOrder": 2,
      "valueBalance": 87.25,
      "displayOrder": 2,
      "isActive": true,
      "createdAt": "2025-01-02T00:00:00Z"
    }
  ]
}
```

#### Create New Profile

```http
POST /profiles
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "nickname": "Knight",
  "avatarId": "knight_001",
  "soundId": "sword_001",
  "birthOrder": 3,
  "displayOrder": 3
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "id": "profile_003",
    "nickname": "Knight",
    "avatarId": "knight_001",
    "soundId": "sword_001",
    "birthOrder": 3,
    "valueBalance": 0.0,
    "displayOrder": 3,
    "isActive": true,
    "createdAt": "2025-07-09T10:30:00Z"
  }
}
```

#### Get Profile Details

```http
GET /profiles/{profileId}
Authorization: Bearer <access_token>
```

#### Update Profile

```http
PUT /profiles/{profileId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "nickname": "Sir Dragon",
  "avatarId": "dragon_002",
  "soundId": "roar_002",
  "displayOrder": 1
}
```

#### Delete Profile (Soft Delete)

```http
DELETE /profiles/{profileId}
Authorization: Bearer <access_token>
```

### 5. Task Management Endpoints

#### List All Tasks

```http
GET /tasks
Authorization: Bearer <access_token>
Query Parameters:
  - active: boolean (optional, default: true)
  - page: number (optional, default: 1)
  - limit: number (optional, default: 50)
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_001",
        "title": "Feed the dragon",
        "description": "Give the dragon its daily food",
        "iconId": "food_001",
        "valueAmount": 5.0,
        "isActive": true,
        "displayOrder": 1,
        "createdAt": "2025-01-01T00:00:00Z"
      },
      {
        "id": "task_002",
        "title": "Polish armor",
        "description": "Keep the knight's armor shiny",
        "iconId": "armor_001",
        "valueAmount": 3.5,
        "isActive": true,
        "displayOrder": 2,
        "createdAt": "2025-01-02T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2,
      "pages": 1
    }
  }
}
```

#### Create New Task

```http
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Clean castle",
  "description": "Sweep the great hall",
  "iconId": "cleaning_001",
  "valueAmount": 10.00,
  "displayOrder": 3
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "id": "task_003",
    "title": "Clean castle",
    "description": "Sweep the great hall",
    "iconId": "cleaning_001",
    "valueAmount": 10.0,
    "isActive": true,
    "displayOrder": 3,
    "createdAt": "2025-07-09T10:30:00Z"
  }
}
```

#### Update Task

```http
PUT /tasks/{taskId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Clean royal castle",
  "description": "Sweep and mop the great hall",
  "valueAmount": 12.00,
  "isActive": false
}
```

#### Delete Task (Soft Delete)

```http
DELETE /tasks/{taskId}
Authorization: Bearer <access_token>
```

### 6. Activity Recording Endpoints

#### Record Task Completion

```http
POST /activities
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "profileId": "profile_001",
  "taskId": "task_001",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." // Optional, Premium only
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "id": "activity_001",
    "profileId": "profile_001",
    "taskId": "task_001",
    "recordedAt": "2025-07-09T10:30:00Z",
    "recordedValue": 5.0,
    "reviewStatus": "pending",
    "photoUrl": "https://cdn.taschengeld.com/photos/activity_001.jpg"
  }
}
```

#### List Pending Activities

```http
GET /activities/pending
Authorization: Bearer <access_token>
Query Parameters:
  - profileId: string (optional, filter by profile)
  - page: number (optional, default: 1)
  - limit: number (optional, default: 50)
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_001",
        "profile": {
          "id": "profile_001",
          "nickname": "Dragon",
          "avatarId": "dragon_001"
        },
        "task": {
          "id": "task_001",
          "title": "Feed the dragon",
          "iconId": "food_001"
        },
        "recordedAt": "2025-07-09T10:30:00Z",
        "recordedValue": 5.0,
        "reviewStatus": "pending",
        "photoUrl": "https://cdn.taschengeld.com/photos/activity_001.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### Review Activity

```http
POST /activities/{activityId}/review
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "approved", // "approved" or "rejected"
  "note": "Great job!"
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "id": "activity_001",
    "reviewStatus": "approved",
    "reviewedAt": "2025-07-09T10:35:00Z",
    "reviewNote": "Great job!",
    "transactionId": "tx_001"
  }
}
```

#### Bulk Review Activities

```http
POST /activities/bulk-review
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "activities": [
    {
      "id": "activity_001",
      "status": "approved",
      "note": "Great job!"
    },
    {
      "id": "activity_002",
      "status": "rejected",
      "note": "Task not completed properly"
    }
  ]
}
```

### 7. Value Tracking Endpoints

#### Get All Profile Balances

```http
GET /values/balances
Authorization: Bearer <access_token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "profileId": "profile_001",
        "nickname": "Dragon",
        "avatarId": "dragon_001",
        "balance": 125.5,
        "lastTransaction": "2025-07-09T10:30:00Z"
      },
      {
        "profileId": "profile_002",
        "nickname": "Bunny",
        "avatarId": "bunny_001",
        "balance": 87.25,
        "lastTransaction": "2025-07-08T15:20:00Z"
      }
    ],
    "totalHouseholdValue": 212.75
  }
}
```

#### Get Transaction History

```http
GET /values/transactions
Authorization: Bearer <access_token>
Query Parameters:
  - profileId: string (optional, filter by profile)
  - page: number (optional, default: 1)
  - limit: number (optional, default: 50)
  - startDate: string (optional, ISO date)
  - endDate: string (optional, ISO date)
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_001",
        "profileId": "profile_001",
        "profileNickname": "Dragon",
        "transactionType": "task_reward",
        "amount": 5.0,
        "balanceAfter": 125.5,
        "description": "Completed: Feed the dragon",
        "activityRecordId": "activity_001",
        "createdAt": "2025-07-09T10:35:00Z"
      },
      {
        "id": "tx_002",
        "profileId": "profile_001",
        "profileNickname": "Dragon",
        "transactionType": "manual_withdraw",
        "amount": -10.0,
        "balanceAfter": 120.5,
        "description": "Bought toy dragon",
        "createdAt": "2025-07-08T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2,
      "pages": 1
    }
  }
}
```

#### Create Manual Transaction

```http
POST /values/manual
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "profileId": "profile_001",
  "transactionType": "manual_deposit", // "manual_deposit" or "manual_withdraw"
  "amount": 15.00,
  "description": "Birthday gift"
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "data": {
    "id": "tx_003",
    "profileId": "profile_001",
    "transactionType": "manual_deposit",
    "amount": 15.0,
    "balanceAfter": 140.5,
    "description": "Birthday gift",
    "createdAt": "2025-07-09T10:40:00Z"
  }
}
```

### 8. Asset Library Endpoints

#### Get Avatar Library

```http
GET /assets/avatars
Authorization: Bearer <access_token>
Query Parameters:
  - category: string (optional, filter by category)
  - tier: string (optional, filter by subscription tier)
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "avatars": [
      {
        "id": "dragon_001",
        "category": "fantasy",
        "imageUrl": "https://cdn.taschengeld.com/avatars/dragon_001.png",
        "requiredTier": "free",
        "isActive": true
      },
      {
        "id": "knight_001",
        "category": "fantasy",
        "imageUrl": "https://cdn.taschengeld.com/avatars/knight_001.png",
        "requiredTier": "basic",
        "isActive": true
      }
    ],
    "categories": ["fantasy", "animals", "professions", "abstract"],
    "userTier": "basic"
  }
}
```

#### Get Icon Library

```http
GET /assets/icons
Authorization: Bearer <access_token>
```

#### Get Sound Library

```http
GET /assets/sounds
Authorization: Bearer <access_token>
```

#### Upload Custom Asset (Premium Only)

```http
POST /assets/custom
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "type": "avatar", // "avatar" or "icon"
  "file": [binary data],
  "name": "My Custom Dragon"
}
```

### 9. Reporting Endpoints (Premium Only)

#### Generate PDF Report

```http
POST /reports/generate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reportType": "member_activity", // "member_activity", "task_completion", "household_summary"
  "profileId": "profile_001", // Optional, for member-specific reports
  "startDate": "2025-07-01T00:00:00Z",
  "endDate": "2025-07-31T23:59:59Z"
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "reportId": "report_001",
    "status": "generating",
    "estimatedCompletion": "2025-07-09T10:45:00Z"
  }
}
```

#### Get Report Status

```http
GET /reports/{reportId}/status
Authorization: Bearer <access_token>
```

#### Download Report

```http
GET /reports/{reportId}/download
Authorization: Bearer <access_token>
```

### 10. Backup & Recovery Endpoints

#### Create Backup (Manual)

```http
POST /backup/create
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "full", // "full" or "incremental"
  "note": "Before major changes"
}
```

#### List Available Backups

```http
GET /backup/list
Authorization: Bearer <access_token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "id": "backup_001",
        "type": "full",
        "createdAt": "2025-07-09T10:30:00Z",
        "size": "2.5MB",
        "note": "Before major changes",
        "canRestore": true
      },
      {
        "id": "backup_002",
        "type": "automatic",
        "createdAt": "2025-07-08T02:00:00Z",
        "size": "2.3MB",
        "note": "Daily automatic backup",
        "canRestore": true
      }
    ],
    "retentionDays": 5, // Based on subscription tier
    "nextAutoBackup": "2025-07-10T02:00:00Z"
  }
}
```

#### Restore from Backup

```http
POST /backup/{backupId}/restore
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "confirmation": "RESTORE_FROM_BACKUP"
}
```

#### Export Data

```http
GET /backup/export
Authorization: Bearer <access_token>
Query Parameters:
  - format: string (optional, "json" or "csv", default: "json")
```

### 11. System Information Endpoints

#### Get System Status

```http
GET /system/status
```

**Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "status": "operational",
    "version": "1.0.0",
    "timestamp": "2025-07-09T10:30:00Z",
    "maintenance": false
  }
}
```

#### Get Available Features

```http
GET /system/features
Authorization: Bearer <access_token>
```

## Error Handling

### Error Response Format

All error responses follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2025-07-09T10:30:00Z",
    "requestId": "req_abc123xyz"
  }
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: System maintenance

### Common Error Codes

#### Authentication Errors

- `AUTH_REQUIRED`: Authentication token required
- `AUTH_INVALID`: Invalid authentication token
- `AUTH_EXPIRED`: Authentication token expired
- `EMAIL_NOT_VERIFIED`: Email address not verified
- `ACCOUNT_SUSPENDED`: Account is suspended
- `INVALID_CREDENTIALS`: Invalid email/password

#### Authorization Errors

- `INSUFFICIENT_PERMISSIONS`: Permission denied
- `SUBSCRIPTION_REQUIRED`: Paid subscription required
- `TIER_UPGRADE_REQUIRED`: Higher tier required
- `FEATURE_NOT_AVAILABLE`: Feature not available in current tier

#### Validation Errors

- `VALIDATION_ERROR`: Request validation failed
- `INVALID_FORMAT`: Invalid data format
- `MISSING_REQUIRED_FIELD`: Required field missing
- `FIELD_TOO_LONG`: Field exceeds maximum length
- `FIELD_TOO_SHORT`: Field below minimum length

#### Resource Errors

- `RESOURCE_NOT_FOUND`: Resource does not exist
- `RESOURCE_ALREADY_EXISTS`: Resource already exists
- `RESOURCE_LIMIT_EXCEEDED`: Subscription limit exceeded
- `RESOURCE_CONFLICT`: Resource state conflict

#### Business Logic Errors

- `INSUFFICIENT_BALANCE`: Not enough value in account
- `TASK_ALREADY_COMPLETED`: Task already completed today
- `ACTIVITY_ALREADY_REVIEWED`: Activity already reviewed
- `BACKUP_NOT_AVAILABLE`: Backup not available for restore

## Rate Limiting

### Rate Limit Configuration

Rate limits are applied per subscriber and vary by subscription tier:

```typescript
interface RateLimits {
  requests: {
    perMinute: number;
    perHour: number;
    perDay: number;
  };
  burst: number;
}

const RATE_LIMITS: Record<SubscriptionTier, RateLimits> = {
  free: {
    requests: {
      perMinute: 60,
      perHour: 1000,
      perDay: 10000,
    },
    burst: 10,
  },
  basic: {
    requests: {
      perMinute: 120,
      perHour: 2000,
      perDay: 20000,
    },
    burst: 20,
  },
  premium: {
    requests: {
      perMinute: 300,
      perHour: 5000,
      perDay: 50000,
    },
    burst: 50,
  },
};
```

### Rate Limit Headers

All responses include rate limit headers:

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1704968700
X-RateLimit-Retry-After: 60
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 120,
      "remaining": 0,
      "resetAt": "2025-07-09T10:35:00Z"
    }
  }
}
```

## Subscription Tier Enforcement

### Tier-Based Limits

API endpoints enforce limits based on subscription tier:

```typescript
interface TierLimits {
  maxMembers: number | 'unlimited';
  maxTasks: number | 'unlimited';
  maxActivitiesPerDay: number | 'unlimited';
  features: {
    photoAttachments: boolean;
    customSymbols: boolean;
    customTerminology: boolean;
    reporting: boolean;
    apiAccess: boolean;
  };
}
```

### Limit Enforcement Examples

#### Creating a Profile

```http
POST /profiles
```

**Free tier reaching limit**:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_LIMIT_EXCEEDED",
    "message": "Maximum number of profiles reached",
    "details": {
      "current": 1,
      "limit": 1,
      "tier": "free",
      "upgradeRequired": "basic"
    }
  }
}
```

#### Uploading Photo (Premium Only)

```http
POST /activities
Content-Type: application/json

{
  "photo": "base64_image_data"
}
```

**Basic tier attempting premium feature**:

```json
{
  "success": false,
  "error": {
    "code": "FEATURE_NOT_AVAILABLE",
    "message": "Photo attachments require Premium subscription",
    "details": {
      "feature": "photoAttachments",
      "currentTier": "basic",
      "requiredTier": "premium"
    }
  }
}
```

## Webhooks

### Webhook Configuration

Subscribers can configure webhook endpoints for real-time notifications:

```http
POST /webhooks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/taschengeld",
  "events": ["activity.completed", "activity.reviewed", "profile.created"],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

#### Activity Completed

```json
{
  "event": "activity.completed",
  "timestamp": "2025-07-09T10:30:00Z",
  "data": {
    "activityId": "activity_001",
    "profileId": "profile_001",
    "profileNickname": "Dragon",
    "taskId": "task_001",
    "taskTitle": "Feed the dragon",
    "valueAmount": 5.0
  }
}
```

#### Activity Reviewed

```json
{
  "event": "activity.reviewed",
  "timestamp": "2025-07-09T10:35:00Z",
  "data": {
    "activityId": "activity_001",
    "status": "approved",
    "reviewNote": "Great job!",
    "transactionId": "tx_001"
  }
}
```

### Webhook Security

All webhook requests include:

- `X-Taschengeld-Signature`: HMAC-SHA256 signature
- `X-Taschengeld-Event`: Event type
- `X-Taschengeld-Timestamp`: Request timestamp

## Data Models

### Core Data Types

```typescript
interface Subscriber {
  id: string;
  email: string;
  emailVerified: boolean;
  householdName: string;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'canceled';
  subscriptionEndDate: string;
  locale: string;
  theme: 'light' | 'dark';
  currencyDisplay: string;
  customTerminology?: Record<string, string>;
  createdAt: string;
  lastLoginAt: string;
}

interface HouseholdProfile {
  id: string;
  nickname: string;
  avatarId: string;
  soundId?: string;
  birthOrder?: number;
  valueBalance: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface HouseholdTask {
  id: string;
  title: string;
  description?: string;
  iconId: string;
  valueAmount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

interface ActivityRecord {
  id: string;
  profileId: string;
  taskId: string;
  recordedAt: string;
  recordedValue: number;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewNote?: string;
  photoUrl?: string;
  transactionId?: string;
}

interface ValueTransaction {
  id: string;
  profileId: string;
  transactionType: 'task_reward' | 'manual_deposit' | 'manual_withdraw';
  amount: number;
  balanceAfter: number;
  description: string;
  activityRecordId?: string;
  createdAt: string;
}
```

### Validation Schemas

```typescript
// Using Zod for validation
const CreateProfileSchema = z.object({
  nickname: z.string().min(1).max(100),
  avatarId: z.string().min(1),
  soundId: z.string().optional(),
  birthOrder: z.number().int().min(1).max(20).optional(),
  displayOrder: z.number().int().min(0).default(0),
});

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  iconId: z.string().min(1),
  valueAmount: z.number().min(0).max(999999.99),
  displayOrder: z.number().int().min(0).default(0),
});

const RecordActivitySchema = z.object({
  profileId: z.string().uuid(),
  taskId: z.string().uuid(),
  photo: z.string().optional(), // Base64 encoded image
});
```

## Security Considerations

### Data Protection

1. **Encryption**: All sensitive data encrypted at rest and in transit
2. **Data Minimization**: Only collect necessary subscriber data
3. **Isolation**: Multi-tenant data isolation via row-level security
4. **Audit Trail**: Complete audit log of all data access

### Input Validation

1. **Schema Validation**: All inputs validated against Zod schemas
2. **SQL Injection Prevention**: Parameterized queries via Prisma ORM
3. **XSS Prevention**: Content Security Policy headers
4. **File Upload Security**: Virus scanning and type validation

### Authentication Security

1. **JWT Security**: Short-lived access tokens, secure refresh tokens
2. **Password Hashing**: Argon2id for password hashing
3. **Rate Limiting**: Prevent brute force attacks
4. **Session Management**: Secure session handling

## Performance Considerations

### Caching Strategy

1. **Redis Caching**: Session data and frequent queries
2. **CDN Caching**: Static assets and images
3. **Database Optimization**: Proper indexing and query optimization
4. **Client Caching**: ETags and cache headers

### Database Optimization

1. **Indexing**: Optimized indexes for tenant queries
2. **Connection Pooling**: Efficient database connections
3. **Query Optimization**: Optimized queries with proper joins
4. **Read Replicas**: Scaling read operations

## API Testing

### Test Environments

- **Development**: `http://localhost:3000/api/v1`
- **Staging**: `https://api-staging.taschengeld.com/v1`
- **Production**: `https://api.taschengeld.com/v1`

### API Documentation

- **Interactive Docs**: Swagger/OpenAPI at `/docs`
- **Postman Collection**: Available for download
- **SDK**: Official SDKs for JavaScript/TypeScript

### Example Test Scenarios

```javascript
// Test authentication flow
describe('Authentication', () => {
  it('should register new subscriber', async () => {
    const response = await api.post('/auth/register', {
      email: 'test@example.com',
      password: 'password123',
      householdName: 'Test Family',
    });

    expect(response.status).toBe(201);
    expect(response.data.success).toBe(true);
  });
});

// Test tier limitations
describe('Tier Limits', () => {
  it('should enforce free tier member limit', async () => {
    // Create profile on free tier
    const response = await api.post('/profiles', {
      nickname: 'Second Member',
    });

    expect(response.status).toBe(400);
    expect(response.data.error.code).toBe('RESOURCE_LIMIT_EXCEEDED');
  });
});
```

## Conclusion

This API specification provides a comprehensive foundation for the Taschengeld SaaS platform, supporting our core philosophy of providing a household management tool that subscribers can use however they wish. The API is designed to be:

1. **Simple**: Easy to understand and implement
2. **Scalable**: Built for growth from 10 to 10,000+ subscribers
3. **Secure**: Privacy-first with comprehensive security measures
4. **Flexible**: Supports diverse household structures and use cases
5. **Tier-Aware**: Enforces subscription limits while providing upgrade paths

The API enables households to track tasks, activities, and rewards in a structured way while maintaining the flexibility to adapt to their unique needs and terminology.

---

**Document Status**: Complete  
**Next Steps**:

1. Implementation of API endpoints
2. SDK development for client applications
3. Integration testing and performance optimization
4. API documentation and developer portal
