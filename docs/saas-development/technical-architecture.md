# Technical Architecture - Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-09  
**Status**: Draft  
**Project**: Taschengeld SaaS Transformation  
**Philosophy**: Household Management Tool

## Executive Summary

This document defines the technical architecture for Taschengeld SaaS, a household management tool that allows subscribers to track tasks and rewards within their household. The architecture prioritizes simplicity, scalability, and compliance while supporting our core philosophy: we provide the structure, households decide how to use it.

### Key Architecture Principles

1. **Simple Multi-Tenancy**: Shared database with row-level security
2. **Subscriber-First**: Authentication only at the subscriber level
3. **Stateless Architecture**: Horizontal scalability with no server affinity
4. **Privacy by Design**: Minimal data collection, clear ownership model
5. **Progressive Enhancement**: Core features work everywhere, premium features enhance experience

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Global CDN (Cloudflare)                  │
│                    Static Assets, DDoS Protection                │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                      Load Balancer (AWS ALB)                     │
│                         SSL Termination                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                   Next.js Application Cluster                     │
│                  ┌─────────────┬─────────────┐                  │
│                  │   Node 1    │   Node N    │                  │
│                  │  (Fargate)  │  (Fargate)  │                  │
│                  └─────────────┴─────────────┘                  │
│                     Stateless, Auto-scaling                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
┌───────────────┴──┐  ┌────────┴──────┐  ┌────┴────────────────┐
│   PostgreSQL     │  │  Redis Cache  │  │    S3 Storage       │
│   (RDS Multi-AZ) │  │ (ElastiCache) │  │  (Media/Backups)    │
│  Primary Database│  │Session/Cache  │  │  Object Storage     │
└──────────────────┘  └───────────────┘  └─────────────────────┘
```

### Component Details

#### 1. Presentation Layer

**Technology**: Next.js 15 with App Router  
**Deployment**: AWS Fargate (Serverless containers)  
**Scaling**: Horizontal auto-scaling based on CPU/memory

**Key Features**:
- Server-side rendering for SEO and performance
- React Server Components for efficiency
- Progressive Web App capabilities
- Responsive design (320px to 4K)

#### 2. Application Layer

**Architecture Pattern**: Layered architecture with clear separation

```typescript
// Layer Structure
├── /app                    // Next.js App Router
│   ├── /api               // API Routes
│   ├── /(auth)            // Authenticated pages
│   ├── /(public)          // Public pages
│   └── /components        // React components
├── /lib
│   ├── /services          // Business logic layer
│   ├── /repositories      // Data access layer
│   ├── /utils            // Shared utilities
│   └── /validators       // Zod schemas
└── /prisma               // Database schema
```

#### 3. Data Layer

**Primary Database**: PostgreSQL 16 (AWS RDS)
- Multi-AZ deployment for high availability
- Read replicas for scaling read operations
- Automated backups with point-in-time recovery
- Row-level security for multi-tenancy

**Caching Layer**: Redis (AWS ElastiCache)
- Session storage
- Frequent query caching
- Real-time data like active users
- Rate limiting counters

**Object Storage**: AWS S3
- Profile photos (premium feature)
- Database backups
- Export files
- Static assets

## Multi-Tenant Architecture

### Database Design

We use a **shared database with row-level security** approach:

```sql
-- Every table includes subscriber_id for tenant isolation
CREATE TABLE household_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id),
    nickname VARCHAR(100) NOT NULL,
    -- ... other fields
    
    -- Row-level security policy
    CONSTRAINT rls_subscriber_isolation 
        CHECK (subscriber_id = current_setting('app.current_subscriber')::uuid)
);

-- Efficient indexing for tenant queries
CREATE INDEX idx_profiles_subscriber 
    ON household_profiles(subscriber_id);
```

### Tenant Isolation Strategy

1. **Application Level**: All queries filtered by subscriber_id
2. **Database Level**: Row-level security policies
3. **API Level**: JWT tokens contain subscriber_id
4. **Cache Level**: Keys prefixed with subscriber_id

```typescript
// Service layer automatically includes tenant filtering
class ProfileService {
    async getProfiles(subscriberId: string) {
        return prisma.householdProfile.findMany({
            where: { subscriberId },
            orderBy: { displayOrder: 'asc' }
        });
    }
}
```

## Authentication & Authorization

### Subscriber Authentication

**Technology**: NextAuth.js v5 with JWT strategy

```typescript
// Simplified auth flow - only subscribers authenticate
interface AuthToken {
    subscriberId: string;
    email: string;
    subscriptionPlan: 'free' | 'basic' | 'premium';
    subscriptionStatus: 'trial' | 'active' | 'past_due' | 'canceled';
}
```

**Authentication Methods**:
1. Email/Password (Argon2id hashing)
2. Google OAuth 2.0
3. Apple Sign In
4. Magic links (passwordless)

### Household Access Control

**PIN-Based Mode Switching** (No per-profile auth):

```typescript
// Simple PIN verification for mode switching
async function verifyManagerMode(subscriberId: string, pin: string): boolean {
    const subscriber = await getSubscriber(subscriberId);
    return await argon2.verify(subscriber.pinHash, pin);
}

// Modes stored in session
interface SessionData {
    subscriberId: string;
    mode: 'manager' | 'member';
    lastActivity: Date;
}
```

## API Design

### RESTful API Structure

**Base URL**: `https://api.taschengeld.com/v1`

#### Core Endpoints

```yaml
# Subscriber Management (Authenticated)
POST   /auth/register              # Create subscriber account
POST   /auth/login                 # Subscriber login
POST   /auth/logout                # Clear session
GET    /auth/session               # Current session info

# Household Management (Subscriber-scoped)
GET    /household                  # Get household settings
PUT    /household                  # Update settings
POST   /household/pin              # Set/update PIN

# Profile Management
GET    /profiles                   # List all profiles
POST   /profiles                   # Create profile
PUT    /profiles/:id               # Update profile
DELETE /profiles/:id               # Soft delete profile

# Task Management  
GET    /tasks                      # List all tasks
POST   /tasks                      # Create task
PUT    /tasks/:id                  # Update task
DELETE /tasks/:id                  # Soft delete task

# Activity Recording (No auth required within household)
POST   /activities                 # Record task completion
GET    /activities/pending         # Get pending reviews
POST   /activities/:id/review      # Approve/reject activity

# Value Tracking
GET    /values/balances            # All profile balances
GET    /values/transactions        # Transaction history
POST   /values/manual              # Manual adjustment
```

### API Security

1. **Rate Limiting**: Per-subscriber limits stored in Redis
2. **CORS**: Strict origin validation
3. **Input Validation**: Zod schemas for all endpoints
4. **SQL Injection**: Parameterized queries via Prisma
5. **XSS Prevention**: Content Security Policy headers

```typescript
// Rate limiting implementation
const rateLimiter = new RateLimiter({
    points: 100,        // requests
    duration: 60,       // per minute
    keyPrefix: 'api',
    storeClient: redis
});

// Applied at API route level
export async function POST(req: Request) {
    const subscriberId = await getSubscriberId(req);
    await rateLimiter.consume(subscriberId);
    // ... handle request
}
```

## Infrastructure Architecture

### Deployment Environment

**Primary Region**: AWS eu-central-1 (Switzerland)  
**Compliance**: Swiss data residency for GDPR

```yaml
# Infrastructure as Code (Terraform)
Production Stack:
  - VPC with public/private subnets
  - ECS Fargate cluster (serverless containers)
  - RDS PostgreSQL Multi-AZ
  - ElastiCache Redis cluster
  - S3 buckets with encryption
  - CloudFront CDN
  - Route53 DNS
  - Certificate Manager (SSL)
  - Secrets Manager (credentials)
  - CloudWatch (monitoring)
```

### Scaling Strategy

1. **Application Tier**: 
   - Auto-scaling based on CPU/memory
   - Minimum 2 instances for availability
   - Maximum 20 instances for cost control

2. **Database Tier**:
   - Vertical scaling for write capacity
   - Read replicas for read scaling
   - Connection pooling via PgBouncer

3. **Caching Strategy**:
   - Cache static content at CDN
   - Cache session data in Redis
   - Cache frequent queries (5-minute TTL)

### High Availability

- **Multi-AZ deployment** for all critical components
- **Health checks** at load balancer and container level
- **Automated failover** for RDS and ElastiCache
- **Blue-green deployments** for zero-downtime updates

## Security Architecture

### Data Protection

1. **Encryption at Rest**:
   - RDS: AWS KMS encryption
   - S3: AES-256 encryption
   - ElastiCache: Encryption enabled

2. **Encryption in Transit**:
   - TLS 1.3 for all connections
   - Certificate pinning for mobile apps
   - Secure WebSocket for real-time features

3. **Data Minimization**:
   - Only collect subscriber email/auth
   - No PII for household profiles
   - Automatic data expiration for logs

### Application Security

```typescript
// Security headers middleware
export function securityHeaders(): NextResponse {
    const response = NextResponse.next();
    
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; " +
        "connect-src 'self' https://api.taschengeld.com"
    );
    
    return response;
}
```

## Performance Architecture

### Optimization Strategies

1. **Edge Caching**: Static assets served from CDN
2. **Database Optimization**: 
   - Proper indexing on subscriber_id
   - Query optimization with EXPLAIN
   - Connection pooling
3. **Application Caching**:
   - Redis for hot data
   - React Query for client caching
   - Service worker for offline support

### Performance Targets

- **Page Load**: < 2s on 3G networks
- **API Response**: < 200ms p95 latency
- **Availability**: 99.9% uptime SLA
- **Database Queries**: < 50ms average

## Monitoring & Observability

### Application Monitoring

**Technology**: DataDog APM + CloudWatch

```typescript
// Distributed tracing
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('taschengeld-api');

export async function createProfile(data: CreateProfileDto) {
    const span = tracer.startSpan('profile.create');
    
    try {
        span.setAttributes({
            'subscriber.id': data.subscriberId,
            'profile.nickname': data.nickname
        });
        
        const profile = await profileService.create(data);
        span.setStatus({ code: SpanStatusCode.OK });
        return profile;
        
    } catch (error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
    } finally {
        span.end();
    }
}
```

### Metrics & Alerts

**Business Metrics**:
- New subscriber signups
- Subscription conversions
- Active households
- Task completion rates

**Technical Metrics**:
- API latency and error rates
- Database connection pool usage
- Cache hit ratios
- Container CPU/memory usage

## Disaster Recovery

### Backup Strategy

1. **Database**: 
   - Automated daily backups (30-day retention)
   - Point-in-time recovery (7 days)
   - Cross-region backup replication

2. **Application State**:
   - Infrastructure as Code in Git
   - Container images in ECR
   - Secrets in AWS Secrets Manager

### Recovery Procedures

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **Automated failover** for multi-AZ resources
- **Runbook documentation** for manual procedures

## Development & Deployment

### CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    - Run unit tests
    - Run integration tests
    - Security scanning (Snyk)
    - Code quality (SonarQube)
    
  build:
    - Build Docker image
    - Push to ECR
    - Update task definition
    
  deploy:
    - Blue-green deployment
    - Health check validation
    - Automatic rollback on failure
```

### Environment Strategy

1. **Development**: Local Docker Compose
2. **Staging**: AWS environment (scaled down)
3. **Production**: Full AWS environment
4. **Feature Flags**: LaunchDarkly for gradual rollouts

## Cost Optimization

### Architecture Decisions for Cost

1. **Serverless Containers**: Pay only for compute used
2. **Auto-scaling**: Scale down during low usage
3. **Reserved Instances**: For predictable database load
4. **S3 Lifecycle Policies**: Archive old exports
5. **CDN Caching**: Reduce origin requests

### Estimated Monthly Costs (1000 subscribers)

```
Compute (Fargate):        $150
Database (RDS):           $200
Cache (ElastiCache):      $50
Storage (S3):             $20
CDN (CloudFront):         $30
Load Balancer:            $25
Data Transfer:            $50
------------------------
Total:                    ~$525/month
```

## Migration Strategy

### From Self-Hosted to SaaS

1. **Data Export**: Provide export tool for Docker users
2. **Import Wizard**: Guided import process
3. **Subscription Mapping**: One Docker instance = One subscription
4. **Grandfathered Plans**: Special pricing for early adopters

### Zero-Downtime Migration

```typescript
// Migration service
class MigrationService {
    async importDockerExport(subscriberId: string, exportData: DockerExport) {
        // Validate export format
        const validation = await validateExport(exportData);
        
        // Create transaction for atomic import
        await prisma.$transaction(async (tx) => {
            // Import profiles
            for (const user of exportData.users) {
                await tx.householdProfile.create({
                    data: {
                        subscriberId,
                        nickname: user.name,
                        avatarId: mapAvatar(user.avatar),
                        valueBalance: user.balance
                    }
                });
            }
            
            // Import tasks
            for (const task of exportData.tasks) {
                await tx.householdTask.create({
                    data: {
                        subscriberId,
                        title: task.name,
                        valueAmount: task.value,
                        iconId: mapIcon(task.icon)
                    }
                });
            }
        });
    }
}
```

## Future Considerations

### Planned Enhancements

1. **Real-time Updates**: WebSocket for live updates
2. **Mobile Apps**: React Native applications
3. **API Versioning**: GraphQL federation
4. **Advanced Analytics**: Household insights
5. **Internationalization**: Multi-region deployment

### Technology Radar

**Adopt**:
- Edge computing for reduced latency
- Bun runtime for performance
- Tanstack Router for type-safety

**Trial**:
- tRPC for end-to-end type safety
- Temporal for workflow orchestration
- ClickHouse for analytics

**Assess**:
- WebAssembly for compute-intensive features
- CockroachDB for global distribution
- Remix as Next.js alternative

## Conclusion

This architecture provides a solid foundation for Taschengeld SaaS that:

1. **Scales efficiently** from 10 to 10,000 subscribers
2. **Maintains simplicity** despite multi-tenancy
3. **Ensures compliance** with minimal data collection
4. **Delivers performance** across all devices
5. **Controls costs** through smart architecture choices

The key to success is maintaining our core philosophy: we provide the tool, households decide how to use it. This simplicity permeates every architectural decision, resulting in a system that is both powerful and maintainable.

---

**Document Status**: Ready for Review  
**Next Steps**: 
1. Stakeholder review and approval
2. Create detailed API specification
3. Design system component library
4. Infrastructure as Code implementation