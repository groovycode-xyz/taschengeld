# Multi-Tenant Architecture for Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-08  
**Status**: Planning Phase

## Overview

This document outlines the multi-tenant architecture strategy for transforming Taschengeld from a single-tenant self-hosted application to a multi-tenant SaaS platform. The architecture must support thousands of families while maintaining data isolation, performance, and security.

## Current Single-Tenant Architecture

### Database Schema (Current)

```sql
-- Current tables without tenant isolation
users (user_id, name, icon, birthday, ...)
tasks (task_id, title, description, payout_value, ...)
completed_tasks (c_task_id, user_id, task_id, ...)
piggybank_accounts (account_id, user_id, balance, ...)
piggybank_transactions (transaction_id, account_id, amount, ...)
app_settings (setting_id, setting_key, setting_value, ...)
```

### Application Architecture (Current)

- **Single Database**: One PostgreSQL database per deployment
- **No Tenant Concept**: Application assumes single family
- **Global Settings**: App-wide configuration without isolation
- **Direct Database Access**: Services query without tenant filtering

## Multi-Tenant Architecture Strategy

### Tenant Isolation Approach

#### Option 1: Shared Database with Tenant ID (Recommended)

- **Approach**: Add `tenant_id` column to all tables
- **Advantages**: Cost-effective, easier to maintain, shared infrastructure
- **Disadvantages**: Risk of data leakage, complex queries
- **Best For**: Our use case with thousands of small tenants

#### Option 2: Database per Tenant

- **Approach**: Separate database for each tenant
- **Advantages**: Perfect isolation, easier backup/restore per tenant
- **Disadvantages**: High cost, complex management, resource waste
- **Best For**: Large enterprise customers (not our target)

#### Option 3: Schema per Tenant

- **Approach**: Separate schema within shared database
- **Advantages**: Good isolation, shared infrastructure
- **Disadvantages**: Complex connection management, limited scalability
- **Best For**: Medium number of larger tenants

### Recommended Architecture: Shared Database with Row-Level Security

## Database Schema Transformation

### Core Tenant Tables

```sql
-- Main tenant table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- for subdomain routing
    subscription_status VARCHAR(50) DEFAULT 'trial',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    billing_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    settings JSONB DEFAULT '{}'::jsonb
);

-- User account management (separate from family users)
CREATE TABLE user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'parent', -- parent, child, admin
    is_primary BOOLEAN DEFAULT false, -- primary account holder
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Subscription and billing
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    plan_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Usage tracking for billing
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL, -- users, tasks, transactions
    metric_value INTEGER DEFAULT 0,
    billing_period VARCHAR(50), -- 2025-01, 2025-02, etc.
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### Existing Tables Migration

```sql
-- Add tenant_id to all existing tables
ALTER TABLE users ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE completed_tasks ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE piggybank_accounts ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE piggybank_transactions ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE app_settings ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_completed_tasks_tenant_id ON completed_tasks(tenant_id);
CREATE INDEX idx_piggybank_accounts_tenant_id ON piggybank_accounts(tenant_id);
CREATE INDEX idx_piggybank_transactions_tenant_id ON piggybank_transactions(tenant_id);
CREATE INDEX idx_app_settings_tenant_id ON app_settings(tenant_id);

-- Create compound indexes for common queries
CREATE INDEX idx_users_tenant_active ON users(tenant_id, created_at) WHERE created_at IS NOT NULL;
CREATE INDEX idx_tasks_tenant_active ON tasks(tenant_id, is_active) WHERE is_active = true;
CREATE INDEX idx_completed_tasks_tenant_status ON completed_tasks(tenant_id, payment_status);
```

### Row-Level Security Implementation

```sql
-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE piggybank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE piggybank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY tenant_isolation_users ON users
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_tasks ON tasks
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_completed_tasks ON completed_tasks
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_piggybank_accounts ON piggybank_accounts
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_piggybank_transactions ON piggybank_transactions
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_app_settings ON app_settings
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

## Application Architecture Changes

### Tenant Context Management

```typescript
// lib/tenant-context.ts
export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  subscriptionStatus: string;
  planLimits: PlanLimits;
}

export interface PlanLimits {
  maxUsers: number;
  maxTasks: number;
  maxFamilies: number;
  features: string[];
}

// Tenant middleware for API routes
export function withTenantContext(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const tenantContext = await resolveTenantContext(req);

    if (!tenantContext) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Set tenant context for database queries
    await setTenantContext(tenantContext.tenantId);

    // Add tenant context to request
    req.tenantContext = tenantContext;

    return handler(req, res);
  };
}

// Tenant resolution strategies
async function resolveTenantContext(req: NextApiRequest): Promise<TenantContext | null> {
  // Strategy 1: Subdomain routing (tenant.taschengeld.com)
  const subdomain = extractSubdomain(req.headers.host);
  if (subdomain) {
    return await getTenantBySlug(subdomain);
  }

  // Strategy 2: JWT token with tenant claim
  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    return await getTenantById(payload.tenantId);
  }

  // Strategy 3: API key with tenant association
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    return await getTenantByApiKey(apiKey);
  }

  return null;
}
```

### Service Layer Updates

```typescript
// lib/services/base-service.ts
export abstract class BaseService {
  protected tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  protected async withTenantContext<T>(operation: () => Promise<T>): Promise<T> {
    // Set tenant context for this operation
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${this.tenantId}`;
    return await operation();
  }
}

// lib/services/user-service.ts
export class UserService extends BaseService {
  async findAll(): Promise<User[]> {
    return this.withTenantContext(async () => {
      return await prisma.user.findMany({
        where: { tenant_id: this.tenantId }, // Explicit filter as backup
      });
    });
  }

  async create(userData: CreateUserData): Promise<User> {
    return this.withTenantContext(async () => {
      return await prisma.user.create({
        data: {
          ...userData,
          tenant_id: this.tenantId, // Explicitly set tenant
        },
      });
    });
  }
}

// Updated service factory
export function createUserService(tenantId: string): UserService {
  return new UserService(tenantId);
}
```

### API Route Updates

```typescript
// pages/api/users/index.ts
import { withTenantContext } from '@/lib/tenant-context';
import { createUserService } from '@/lib/services/user-service';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tenantContext } = req;
  const userService = createUserService(tenantContext.tenantId);

  switch (req.method) {
    case 'GET':
      const users = await userService.findAll();
      return res.json(users);

    case 'POST':
      // Check plan limits before creation
      const currentUserCount = await userService.count();
      if (currentUserCount >= tenantContext.planLimits.maxUsers) {
        return res.status(403).json({
          error: 'User limit reached for current plan',
          limit: tenantContext.planLimits.maxUsers,
        });
      }

      const newUser = await userService.create(req.body);
      return res.status(201).json(newUser);

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withTenantContext(handler);
```

## Data Migration Strategy

### Phase 1: Schema Preparation

```sql
-- Create tenant management tables
CREATE TABLE tenants (...);
CREATE TABLE user_accounts (...);
CREATE TABLE subscriptions (...);

-- Add tenant_id columns (nullable initially)
ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE tasks ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- ... other tables
```

### Phase 2: Data Migration

```typescript
// scripts/migrate-docker-users.ts
export async function migrateDockerDeployment(dockerData: DockerUserData) {
  const transaction = await prisma.$transaction(async (tx) => {
    // 1. Create tenant
    const tenant = await tx.tenant.create({
      data: {
        name: dockerData.familyName || 'Family',
        slug: generateUniqueSlug(dockerData.familyName),
        subscription_status: 'grandfathered',
        subscription_plan: 'free_legacy',
      },
    });

    // 2. Create primary user account
    const primaryUser = await tx.userAccount.create({
      data: {
        email: dockerData.primaryEmail,
        tenant_id: tenant.id,
        role: 'parent',
        is_primary: true,
      },
    });

    // 3. Migrate family users
    for (const user of dockerData.users) {
      await tx.user.create({
        data: {
          ...user,
          tenant_id: tenant.id,
        },
      });
    }

    // 4. Migrate tasks, completed tasks, etc.
    // ... similar pattern for all entities

    return { tenant, primaryUser };
  });

  return transaction;
}
```

### Phase 3: Schema Enforcement

```sql
-- Make tenant_id required after migration
ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN tenant_id SET NOT NULL;
-- ... other tables

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ... create policies
```

## Performance Considerations

### Database Optimization

```sql
-- Partitioning for large tables (if needed)
CREATE TABLE piggybank_transactions_y2025 PARTITION OF piggybank_transactions
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Materialized views for analytics
CREATE MATERIALIZED VIEW tenant_usage_summary AS
SELECT
    tenant_id,
    COUNT(DISTINCT user_id) as user_count,
    COUNT(DISTINCT task_id) as task_count,
    SUM(amount) as total_transactions
FROM piggybank_transactions
GROUP BY tenant_id;

-- Refresh schedule
CREATE OR REPLACE FUNCTION refresh_tenant_usage_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW tenant_usage_summary;
END;
$$ LANGUAGE plpgsql;

-- Cron job for regular refresh
SELECT cron.schedule('refresh-usage-summary', '0 2 * * *', 'SELECT refresh_tenant_usage_summary();');
```

### Caching Strategy

```typescript
// lib/cache/tenant-cache.ts
import Redis from 'ioredis';

export class TenantCache {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async getTenantContext(tenantId: string): Promise<TenantContext | null> {
    const cached = await this.redis.get(`tenant:${tenantId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const tenant = await this.fetchTenantFromDb(tenantId);
    if (tenant) {
      await this.redis.setex(`tenant:${tenantId}`, 3600, JSON.stringify(tenant));
    }

    return tenant;
  }

  async invalidateTenant(tenantId: string): Promise<void> {
    await this.redis.del(`tenant:${tenantId}`);
  }
}
```

## Security Considerations

### Tenant Isolation

1. **Database Level**: Row-level security policies
2. **Application Level**: Explicit tenant filtering in queries
3. **API Level**: Tenant context validation in middleware
4. **UI Level**: Tenant-specific routing and authorization

### Data Protection

```typescript
// lib/security/tenant-validator.ts
export class TenantValidator {
  static async validateTenantAccess(userAccountId: string, tenantId: string): Promise<boolean> {
    const userAccount = await prisma.userAccount.findFirst({
      where: {
        id: userAccountId,
        tenant_id: tenantId,
      },
    });

    return !!userAccount;
  }

  static async validateResourceAccess(
    tenantId: string,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    // Validate that resource belongs to tenant
    const query = `SELECT 1 FROM ${resourceType} WHERE id = $1 AND tenant_id = $2`;
    const result =
      await prisma.$queryRaw`SELECT 1 FROM ${resourceType} WHERE id = ${resourceId} AND tenant_id = ${tenantId}`;

    return result.length > 0;
  }
}
```

## Monitoring and Observability

### Usage Tracking

```typescript
// lib/monitoring/usage-tracker.ts
export class UsageTracker {
  static async trackUsage(tenantId: string, metric: string, value: number = 1): Promise<void> {
    const billingPeriod = getCurrentBillingPeriod();

    await prisma.usageTracking.upsert({
      where: {
        tenant_id_metric_name_billing_period: {
          tenant_id: tenantId,
          metric_name: metric,
          billing_period: billingPeriod,
        },
      },
      update: {
        metric_value: { increment: value },
      },
      create: {
        tenant_id: tenantId,
        metric_name: metric,
        metric_value: value,
        billing_period: billingPeriod,
      },
    });
  }
}

// Usage in services
export class TaskService extends BaseService {
  async create(taskData: CreateTaskData): Promise<Task> {
    const task = await this.withTenantContext(async () => {
      return await prisma.task.create({
        data: {
          ...taskData,
          tenant_id: this.tenantId,
        },
      });
    });

    // Track usage for billing
    await UsageTracker.trackUsage(this.tenantId, 'tasks_created');

    return task;
  }
}
```

### Health Checks

```typescript
// pages/api/health/tenant.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check tenant isolation
    const tenantCount = await prisma.tenant.count();

    // Check RLS policies
    const rlsStatus = await prisma.$queryRaw`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename IN ('users', 'tasks', 'completed_tasks')
    `;

    // Check database performance
    const avgResponseTime = await measureQueryPerformance();

    return res.json({
      status: 'healthy',
      tenantCount,
      rlsPolicies: rlsStatus.length,
      avgResponseTime: `${avgResponseTime}ms`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// __tests__/services/user-service.test.ts
describe('UserService', () => {
  let userService: UserService;
  let tenant: Tenant;

  beforeEach(async () => {
    tenant = await createTestTenant();
    userService = new UserService(tenant.id);
  });

  afterEach(async () => {
    await cleanupTestTenant(tenant.id);
  });

  it('should only return users for current tenant', async () => {
    // Create users in different tenants
    const tenant1User = await createTestUser(tenant.id);
    const tenant2 = await createTestTenant();
    const tenant2User = await createTestUser(tenant2.id);

    const users = await userService.findAll();

    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(tenant1User.id);
    expect(users.find((u) => u.id === tenant2User.id)).toBeUndefined();
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/tenant-isolation.test.ts
describe('Tenant Isolation', () => {
  it('should prevent cross-tenant data access', async () => {
    const tenant1 = await createTestTenant();
    const tenant2 = await createTestTenant();

    const user1 = await createTestUser(tenant1.id);
    const user2 = await createTestUser(tenant2.id);

    // Try to access tenant2 data with tenant1 context
    const userService = new UserService(tenant1.id);
    const user = await userService.findById(user2.id);

    expect(user).toBeNull();
  });
});
```

## Rollback Strategy

### Emergency Rollback

```typescript
// scripts/emergency-rollback.ts
export async function rollbackToSingleTenant() {
  console.log('Starting emergency rollback...');

  // 1. Disable RLS
  await prisma.$executeRaw`ALTER TABLE users DISABLE ROW LEVEL SECURITY`;
  await prisma.$executeRaw`ALTER TABLE tasks DISABLE ROW LEVEL SECURITY`;
  // ... other tables

  // 2. Remove tenant_id columns (if safe)
  // This would require careful data export first

  // 3. Restore single-tenant application
  // Deploy previous version of application

  console.log('Rollback completed');
}
```

## Conclusion

This multi-tenant architecture provides a scalable foundation for the Taschengeld SaaS transformation while maintaining strong data isolation and security. The phased migration approach minimizes risk while the caching and monitoring strategies ensure good performance and observability.

The key success factors are:

1. **Rigorous tenant isolation** at database and application levels
2. **Comprehensive testing** of tenant boundaries
3. **Performance optimization** through caching and indexing
4. **Monitoring and alerting** for tenant-specific issues
5. **Clear rollback procedures** for emergency situations

---

**Next Steps**:

1. Implement tenant context management system
2. Create database migration scripts
3. Update service layer with tenant isolation
4. Implement comprehensive test suite
5. Set up monitoring and alerting
