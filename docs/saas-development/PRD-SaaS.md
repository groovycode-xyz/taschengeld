# Product Requirements Document (PRD) - Taschengeld SaaS

**Document Version**: 2.0  
**Date**: 2025-07-09  
**Status**: Living Document  
**Product Name**: Taschengeld SaaS - Household Management Tool

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Problem Statement](#problem-statement)
4. [Product Goals & Success Metrics](#product-goals--success-metrics)
5. [User Personas](#user-personas)
6. [Product Features](#product-features)
7. [User Journey Maps](#user-journey-maps)
8. [Technical Overview](#technical-overview)
9. [Business Model](#business-model)
10. [Constraints & Assumptions](#constraints--assumptions)
11. [Timeline & Milestones](#timeline--milestones)
12. [Document Registry](#document-registry)

## Executive Summary

Taschengeld SaaS transforms the existing self-hosted household management tool into a subscription-based web application accessible globally. The product maintains its core value proposition of providing structure for households to track tasks and rewards while removing the technical barriers of Docker deployment.

### Key Transformation Points

- **From**: Self-hosted Docker application → **To**: Cloud-based SaaS platform
- **From**: Single-household deployment → **To**: Multi-tenant architecture
- **From**: Desktop/tablet only → **To**: Mobile-first responsive design
- **From**: PIN-based access → **To**: Subscriber authentication + PIN modes
- **From**: Free open-source → **To**: Freemium subscription model

## Product Vision

> "Empowering households worldwide to organize tasks and rewards through simple, engaging, and secure digital management tools."

### Vision Components

- **Global Accessibility**: Available to households worldwide via web browser
- **Tool-First**: Providing structure for any household management system
- **Use-Case Agnostic**: Works for families, roommates, gaming groups, teams
- **Privacy-First**: Protecting subscriber data with minimal data collection
- **Customizable**: Supporting diverse terminology and value systems

## Problem Statement

### Current Challenges

1. **Technical Barrier**: 95% of interested users lack Docker/technical knowledge
2. **Device Limitations**: Current 768px minimum excludes mobile phone users
3. **Accessibility**: Self-hosting prevents access from multiple locations
4. **Scalability**: Single-tenant design limits growth potential
5. **Monetization**: No revenue model for sustainability

### Target Opportunity

- **Market Size**: 50M+ households in English/German-speaking countries
- **Pain Point**: Households struggle with task/reward tracking systems
- **Competition Gap**: Existing solutions are child-focused, not universal tools

## Product Goals & Success Metrics

### Primary Goals

1. **User Acquisition**

   - **Goal**: 10,000 registered households in Year 1
   - **Metric**: Monthly Active Households (MAH)
   - **Target**: 20% month-over-month growth

2. **User Engagement**

   - **Goal**: Active weekly usage by household members
   - **Metric**: Weekly Active Users (WAU) / Monthly Active Users (MAU)
   - **Target**: 60% WAU/MAU ratio

3. **Revenue Generation**

   - **Goal**: Sustainable business model
   - **Metric**: Monthly Recurring Revenue (MRR)
   - **Target**: $3,000 MRR by Month 12

4. **User Satisfaction**
   - **Goal**: High subscriber satisfaction
   - **Metric**: Net Promoter Score (NPS)
   - **Target**: NPS > 50

### Secondary Goals

- **Platform Stability**: 99.9% uptime SLA
- **Data Security**: Zero data breaches
- **Compliance**: 100% GDPR/COPPA compliance
- **Performance**: < 2 second page load times globally

## User Personas

### Primary Personas

#### 1. Sarah - The Organized Parent

- **Age**: 35-45
- **Tech Savvy**: Moderate (uses apps, not technical)
- **Children**: 2-3 kids aged 6-14
- **Goals**: Teach financial responsibility, reduce cash handling
- **Pain Points**: Tracking who did what, managing multiple children
- **Device Usage**: Smartphone (70%), Laptop (30%)

#### 2. Marcus - The Busy Professional

- **Age**: 40-50
- **Tech Savvy**: High
- **Children**: 1-2 kids aged 8-16
- **Goals**: Automate allowance, track remotely
- **Pain Points**: Travel frequently, missed payments
- **Device Usage**: Smartphone (60%), Tablet (40%)

#### 3. Emma - The Early Adopter Child

- **Age**: 10-14
- **Tech Savvy**: Very high (digital native)
- **Role**: Active task completer
- **Goals**: Track earnings, save for goals
- **Device Usage**: Parent's tablet/phone (80%), Family computer (20%)

#### 4. Noah - The Younger Child

- **Age**: 6-9
- **Tech Savvy**: Basic (can navigate simple apps)
- **Role**: Occasional task completer
- **Goals**: Visual progress, immediate rewards
- **Device Usage**: Parent's tablet with supervision

### Secondary Personas

- **Grandparent**: Managing grandchildren's allowances
- **Divorced Co-parent**: Shared custody allowance coordination
- **Childcare Provider**: Managing multiple families

## Product Features

### Core Features (MVP)

#### 1. Family Management

- **User Story**: As a parent, I want to create a family account and add my children
- **Features**:
  - Family creation wizard
  - Child profile management (nickname, avatar, age)
  - Parent account with email/password
  - Family member invitation system

#### 2. Task Management

- **User Story**: As a parent, I want to create tasks with values for my children
- **Features**:
  - Task creation with title, description, value
  - Task templates for common chores
  - Icon selection for visual recognition
  - Active/inactive task states

#### 3. Task Completion Flow

- **User Story**: As a child, I want to mark tasks complete and see my earnings
- **Features**:
  - Simple one-tap completion
  - Visual/audio feedback
  - Completion history
  - Photo upload for proof (Premium)

#### 4. Payday System

- **User Story**: As a parent, I want to review and approve completed tasks
- **Features**:
  - Weekly payday dashboard
  - Bulk approve/reject
  - Payment to piggy bank
  - Earning notifications

#### 5. Piggy Bank

- **User Story**: As a family, we want to track savings and spending
- **Features**:
  - Individual accounts per child
  - Balance tracking
  - Transaction history
  - Deposit/withdraw with reasons

### Premium Features

#### 6. Advanced Analytics

- Earning trends and charts
- Task completion patterns
- Savings goals with progress
- Monthly/yearly reports

#### 7. Multi-Family Support

- Manage multiple families (divorced parents, grandparents)
- Separate or combined views
- Cross-family reporting

#### 8. Integrations

- Calendar sync for scheduled tasks
- Export to spreadsheet
- Future: Banking API connections

### Mobile-Specific Features

- Push notifications for task reminders
- Offline task completion with sync
- Quick actions from notification
- Biometric authentication for parents

## User Journey Maps

### Parent Onboarding Journey

1. **Discovery**: Find Taschengeld via search/recommendation
2. **Sign Up**: Create account with email
3. **Family Setup**: Add family name and children
4. **Task Creation**: Set up first tasks
5. **Invitation**: Invite co-parent (optional)
6. **First Payday**: Complete first approval cycle
7. **Habit Formation**: Regular weekly usage

### Child Task Completion Journey

1. **Access**: Open app on family device
2. **Selection**: Choose their profile
3. **View Tasks**: See available tasks
4. **Complete**: Mark task as done
5. **Feedback**: Receive visual/audio reward
6. **Check Balance**: View updated piggy bank

### Payday Approval Journey

1. **Notification**: Weekly payday reminder
2. **Review**: See all completed tasks
3. **Verify**: Check task completion
4. **Approve/Reject**: Make decisions
5. **Process**: Automatic balance updates
6. **Celebrate**: Family views results

## Technical Overview

### Architecture Highlights

- **Multi-tenant**: Shared database with tenant isolation
- **Responsive**: Mobile-first design (320px+)
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Vercel/AWS with global CDN
- **Compliance**: GDPR/COPPA compliant by design

### Key Technical Decisions

- Continue with Next.js 15 for familiarity
- Implement progressive web app features
- Use Stripe for subscription management
- Field-level encryption for sensitive data

### Performance Requirements

- Page load: < 2 seconds globally
- API response: < 500ms average
- Uptime: 99.9% SLA
- Concurrent users: 10,000+

## Business Model

### Subscription Tiers

#### Free - "Family Starter"

- **Price**: $0/month
- **Limits**: 3 children, 10 tasks, basic features
- **Purpose**: User acquisition

#### Basic - "Family Pro"

- **Price**: $4.99/month or $49.99/year
- **Features**: Unlimited children/tasks, photos, reports
- **Target**: Active families

#### Premium - "Family Enterprise"

- **Price**: $9.99/month or $99.99/year
- **Features**: Multiple families, analytics, API access
- **Target**: Extended families, professionals

### Revenue Projections

- **Year 1**: $36,000 ARR (500 paid users)
- **Year 2**: $150,000 ARR (2,000 paid users)
- **Break-even**: Month 18

## Constraints & Assumptions

### Constraints

1. **Regulatory**: Must comply with GDPR, COPPA, Swiss data laws
2. **Technical**: Must work on devices from 2018+
3. **Business**: Bootstrap funding, no external investment initially
4. **Resource**: Single developer + designer for Year 1
5. **Language**: English and German at launch

### Assumptions

1. **Market**: Parents want digital solution for allowances
2. **Adoption**: Freemium model drives conversion
3. **Retention**: Family habit formation reduces churn
4. **Technology**: Next.js remains viable platform
5. **Compliance**: No major regulatory changes

## Timeline & Milestones

### Phase 1: Foundation (Months 1-3)

- ✓ Requirements and architecture
- Multi-tenant database migration
- Authentication system
- Mobile responsive design
- Basic subscription integration

### Phase 2: Core Development (Months 4-6)

- Feature migration to SaaS
- Payment processing
- Compliance implementation
- Beta testing program

### Phase 3: Launch Preparation (Months 7-8)

- Performance optimization
- Security audit
- Documentation
- Marketing site
- Soft launch

### Phase 4: Growth (Months 9-12)

- Feature iterations
- Mobile app development
- Additional languages
- Partnership development

## Document Registry

### Requirements Documentation

| Document                            | Purpose                                     | Status   | Link                                                                 |
| ----------------------------------- | ------------------------------------------- | -------- | -------------------------------------------------------------------- |
| Detailed Requirements Specification | Comprehensive breakdown of all requirements | Pending  | [→ Requirements Specification](./requirements-specification.md)      |
| Regulatory Compliance Architecture  | GDPR, COPPA, privacy requirements           | Complete | [→ Compliance Architecture](./regulatory-compliance-architecture.md) |
| Technical Architecture Document     | System design and technical decisions       | Pending  | [→ Technical Architecture](./technical-architecture.md)              |

### Design Documentation

| Document                 | Purpose                               | Status   | Link                                             |
| ------------------------ | ------------------------------------- | -------- | ------------------------------------------------ |
| Mobile Responsive Design | UI/UX requirements for mobile-first   | Complete | [→ Mobile Design](./mobile-responsive-design.md) |
| User Experience Flows    | Detailed user journeys and wireframes | Pending  | [→ UX Flows](./ux-flows.md)                      |
| Design System            | Component library and style guide     | Pending  | [→ Design System](./design-system.md)            |

### Implementation Documentation

| Document                  | Purpose                            | Status   | Link                                              |
| ------------------------- | ---------------------------------- | -------- | ------------------------------------------------- |
| Authentication Strategy   | User management and security       | Complete | [→ Authentication](./authentication-strategy.md)  |
| Multi-tenant Architecture | Database and isolation strategy    | Complete | [→ Multi-tenancy](./multi-tenant-architecture.md) |
| Subscription Model        | Pricing and billing implementation | Complete | [→ Subscription](./subscription-model.md)         |
| API Specification         | RESTful API design                 | Pending  | [→ API Spec](./api-specification.md)              |

### Planning Documentation

| Document                 | Purpose                       | Status   | Link                                                   |
| ------------------------ | ----------------------------- | -------- | ------------------------------------------------------ |
| SaaS Transformation Plan | Overall strategy and timeline | Complete | [→ Transformation Plan](./saas-transformation-plan.md) |
| Risk Assessment          | Technical and business risks  | Pending  | [→ Risk Assessment](./risk-assessment.md)              |
| Testing Strategy         | QA and testing approach       | Pending  | [→ Testing Strategy](./testing-strategy.md)            |
| Deployment Plan          | CI/CD and release strategy    | Pending  | [→ Deployment](./deployment-plan.md)                   |

### Operational Documentation

| Document           | Purpose                           | Status  | Link                                 |
| ------------------ | --------------------------------- | ------- | ------------------------------------ |
| SLA Definition     | Service level agreements          | Pending | [→ SLA](./sla-definition.md)         |
| Support Procedures | Customer support workflows        | Pending | [→ Support](./support-procedures.md) |
| Monitoring Plan    | Performance and uptime monitoring | Pending | [→ Monitoring](./monitoring-plan.md) |
| Security Policies  | Security procedures and policies  | Pending | [→ Security](./security-policies.md) |

---

## Document Control

**Owner**: Product Team  
**Review Cycle**: Bi-weekly  
**Last Review**: 2025-07-08  
**Next Review**: 2025-07-22

### Version History

| Version | Date       | Author | Changes              |
| ------- | ---------- | ------ | -------------------- |
| 1.0     | 2025-07-08 | System | Initial PRD creation |

### Approval Chain

- [ ] Product Owner
- [ ] Technical Lead
- [ ] Compliance Officer
- [ ] Business Stakeholder

---

**Note**: This is a living document. All sections should be reviewed and updated regularly as the product development progresses and new insights are gained.
