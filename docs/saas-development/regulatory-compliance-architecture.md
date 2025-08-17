# Regulatory Compliance Architecture for Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-08  
**Status**: Planning Phase

## Executive Summary

This document outlines the regulatory compliance requirements and architectural decisions for Taschengeld SaaS, hosted in Switzerland but serving a global audience. Given that the application handles children's data and family financial information, we must comply with multiple regulatory frameworks including GDPR, COPPA, Swiss nFADP, and various global privacy laws.

## Key Regulatory Frameworks

### 1. GDPR (General Data Protection Regulation) - EU

**Applies to**: All EU residents regardless of server location  
**Key Requirements**:

- Lawful basis for processing (consent for children)
- Enhanced protection for children's data
- Data subject rights (access, deletion, portability)
- Privacy by design and default
- Data breach notification (72 hours)
- Data Protection Impact Assessments (DPIA)

### 2. COPPA (Children's Online Privacy Protection Act) - USA

**Applies to**: US children under 13  
**Key Requirements**:

- Verifiable parental consent before collecting data
- Parents' right to review and delete children's data
- No conditioning services on data collection
- Data retention limits
- Security requirements for children's data

### 3. Swiss nFADP (new Federal Act on Data Protection)

**Applies to**: Swiss hosting and Swiss residents  
**Key Requirements**:

- Similar to GDPR but with Swiss-specific requirements
- Data localization preferences
- Enhanced security standards
- Transparency in automated decision-making

### 4. Age of Digital Consent Variations

**Global Variations**:

- EU/GDPR: 16 (can be lowered to 13 by member states)
- UK: 13
- Brazil (LGPD): 18 (parental consent required)
- China (PIPL): 14
- India (DPDP): 18 (parental consent required)

## Architectural Requirements

### Data Architecture

#### 1. Multi-Regional Data Storage Strategy

```typescript
// Data residency configuration
interface DataResidencyConfig {
  tenantId: string;
  primaryRegion: 'CH' | 'EU' | 'US';
  dataClassification: {
    pii: boolean;
    financial: boolean;
    children: boolean;
  };
  encryptionConfig: {
    algorithm: 'AES-256-GCM';
    keyManagement: 'HSM' | 'KMS';
    keyRotationDays: number;
  };
  retentionPolicy: {
    activeDays: number;
    archiveDays: number;
    deletionRequired: boolean;
  };
}

// Implementation
class DataResidencyManager {
  static async determineDataLocation(userId: string): Promise<DataResidencyConfig> {
    const user = await this.getUserLocation(userId);

    // Swiss-first approach with regional compliance
    if (user.country === 'CH') {
      return this.getSwissConfig();
    } else if (this.isEUCountry(user.country)) {
      return this.getEUConfig();
    } else if (user.country === 'US') {
      return this.getUSConfig();
    } else {
      return this.getGlobalConfig();
    }
  }
}
```

#### 2. Enhanced Database Schema for Compliance

```sql
-- User tables with compliance fields
CREATE TABLE user_accounts (
    id UUID PRIMARY KEY,
    email VARCHAR(255),
    email_encrypted VARCHAR(512), -- Encrypted version for PII protection
    age_verification_status VARCHAR(50),
    age_verification_date TIMESTAMP,
    data_residency_region VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Separate children's data with enhanced protection
CREATE TABLE child_profiles (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    parent_account_id UUID NOT NULL,
    nickname VARCHAR(100), -- No real names for children
    birth_year INTEGER, -- Store year only, not full date
    avatar_id VARCHAR(50), -- Pre-approved avatars only
    created_at TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete for audit trail
);

-- Comprehensive consent tracking
CREATE TABLE consent_records (
    id UUID PRIMARY KEY,
    user_account_id UUID NOT NULL,
    child_profile_id UUID, -- If consent is for a child
    consent_type VARCHAR(50), -- 'data_collection', 'marketing', 'third_party'
    consent_version VARCHAR(20),
    granted_at TIMESTAMP,
    granted_by UUID, -- Parent ID if for child
    ip_address_hash VARCHAR(64), -- Hashed for privacy
    user_agent_hash VARCHAR(64),
    withdrawal_date TIMESTAMP,
    withdrawal_reason TEXT,

    INDEX idx_consent_user (user_account_id, consent_type),
    INDEX idx_consent_child (child_profile_id, consent_type)
);

-- Audit trail for all data access
CREATE TABLE data_access_log (
    id UUID PRIMARY KEY,
    accessed_at TIMESTAMP DEFAULT NOW(),
    accessor_id UUID NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    action VARCHAR(50), -- 'read', 'write', 'delete'
    justification TEXT,
    ip_address_hash VARCHAR(64),

    -- Partitioned by month for performance
    PRIMARY KEY (id, accessed_at)
) PARTITION BY RANGE (accessed_at);

-- Data subject requests tracking
CREATE TABLE dsr_requests (
    id UUID PRIMARY KEY,
    request_type VARCHAR(50), -- 'access', 'deletion', 'portability', 'rectification'
    requester_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    status VARCHAR(50),
    requested_at TIMESTAMP,
    verified_at TIMESTAMP,
    completed_at TIMESTAMP,
    response_data JSONB,
    deletion_certificate VARCHAR(255)
);
```

### Consent Management Architecture

#### Parent-Child Consent Flow

```typescript
// Consent management system
class ConsentManager {
  static async obtainParentalConsent(
    parentId: string,
    childData: ChildRegistrationData
  ): Promise<ConsentRecord> {
    // 1. Verify parent identity
    const verificationResult = await this.verifyParentIdentity(parentId);
    if (!verificationResult.verified) {
      throw new ParentVerificationError();
    }

    // 2. Present child-appropriate privacy notice
    const privacyNotice = await this.generateChildPrivacyNotice(childData.age);

    // 3. Capture explicit consent
    const consent = await this.captureConsent({
      parentId,
      childData,
      consentTypes: ['data_collection', 'feature_usage'],
      verificationMethod: verificationResult.method,
      privacyNoticeVersion: privacyNotice.version,
    });

    // 4. Send confirmation email to parent
    await this.sendConsentConfirmation(parentId, consent);

    return consent;
  }

  static async verifyParentIdentity(parentId: string): Promise<VerificationResult> {
    // Multi-factor verification for COPPA compliance
    const methods = [
      this.creditCardVerification, // Small charge verification
      this.knowledgeBasedVerification, // Security questions
      this.documentVerification, // ID upload
      this.emailPlusPhoneVerification, // Multi-channel
    ];

    for (const method of methods) {
      const result = await method(parentId);
      if (result.success) {
        return {
          verified: true,
          method: result.method,
          timestamp: new Date(),
        };
      }
    }

    return { verified: false };
  }
}
```

#### Dynamic Consent UI

```typescript
// Age-appropriate consent interfaces
const ConsentUI = {
  // For parents managing children
  ParentConsentDashboard: () => {
    return (
      <div className="consent-dashboard">
        <h2>Privacy & Consent Settings</h2>

        <section className="child-consents">
          <h3>Children's Privacy Settings</h3>
          {children.map(child => (
            <ChildConsentCard
              key={child.id}
              child={child}
              consents={getChildConsents(child.id)}
              onUpdate={handleConsentUpdate}
            />
          ))}
        </section>

        <section className="data-requests">
          <h3>Data Access Requests</h3>
          <button onClick={requestDataExport}>Export All Family Data</button>
          <button onClick={requestDataDeletion}>Delete Account & Data</button>
        </section>
      </div>
    );
  },

  // Simplified view for older children (13-16)
  TeenPrivacyDashboard: () => {
    return (
      <div className="teen-privacy">
        <h2>Your Privacy Settings</h2>
        <p>Your parent manages your account, but you can see what data we collect:</p>
        <DataTransparencyView />
      </div>
    );
  },
};
```

### Data Subject Rights Implementation

#### Automated DSR Handling

```typescript
class DataSubjectRightsEngine {
  static async handleAccessRequest(requesterId: string): Promise<DataPackage> {
    // 1. Verify requester identity
    await this.verifyIdentity(requesterId);

    // 2. Compile all data
    const userData = await this.compileUserData(requesterId);
    const childrenData = await this.compileChildrenData(requesterId);
    const activityData = await this.compileActivityData(requesterId);

    // 3. Format for portability (GDPR Article 20)
    const dataPackage = {
      format: 'JSON',
      generated: new Date(),
      userData,
      childrenData,
      activityData,
      metadata: {
        sources: this.getDataSources(),
        purposes: this.getProcessingPurposes(),
        retention: this.getRetentionPolicies(),
      },
    };

    // 4. Audit the access
    await this.auditDataAccess(requesterId, 'SUBJECT_ACCESS_REQUEST');

    return dataPackage;
  }

  static async handleDeletionRequest(
    requesterId: string,
    scope: 'SELF' | 'FAMILY'
  ): Promise<DeletionCertificate> {
    // 1. Verify authority (parent for family deletion)
    const authority = await this.verifyDeletionAuthority(requesterId, scope);

    // 2. Check for legal holds or retention requirements
    const holds = await this.checkLegalHolds(requesterId);
    if (holds.length > 0) {
      throw new LegalHoldException(holds);
    }

    // 3. Execute deletion
    const deletionPlan = await this.createDeletionPlan(requesterId, scope);
    const results = await this.executeDeletion(deletionPlan);

    // 4. Generate certificate
    const certificate = await this.generateDeletionCertificate(results);

    return certificate;
  }
}
```

### Security Architecture for Compliance

#### Encryption Strategy

```typescript
// Field-level encryption for sensitive data
class FieldEncryption {
  private static readonly SENSITIVE_FIELDS = [
    'email',
    'real_name',
    'birth_date',
    'ip_address',
    'financial_data',
  ];

  static async encryptField(
    fieldName: string,
    value: string,
    context: EncryptionContext
  ): Promise<EncryptedField> {
    if (!this.SENSITIVE_FIELDS.includes(fieldName)) {
      return { value, encrypted: false };
    }

    const key = await this.getFieldKey(fieldName, context.tenantId);
    const encrypted = await this.encrypt(value, key);

    return {
      value: encrypted,
      encrypted: true,
      keyVersion: key.version,
      algorithm: 'AES-256-GCM',
    };
  }

  static async decryptField(field: EncryptedField, context: DecryptionContext): Promise<string> {
    // Audit sensitive data access
    await this.auditAccess(context.userId, context.reason);

    const key = await this.getFieldKey(field.keyVersion);
    return await this.decrypt(field.value, key);
  }
}
```

#### Breach Detection and Response

```typescript
class BreachDetectionSystem {
  static async detectAnomaly(event: SecurityEvent): Promise<void> {
    const riskScore = await this.calculateRiskScore(event);

    if (riskScore > BREACH_THRESHOLD) {
      await this.initiateBreachProtocol({
        event,
        riskScore,
        affectedUsers: await this.identifyAffectedUsers(event),
        dataTypes: await this.identifyAffectedDataTypes(event),
      });
    }
  }

  static async initiateBreachProtocol(breach: BreachData): Promise<void> {
    // 1. Immediate containment
    await this.containBreach(breach);

    // 2. Start 72-hour GDPR timer
    const notification = await this.prepareNotification(breach);

    // 3. Notify authorities if required
    if (breach.riskScore > AUTHORITY_NOTIFICATION_THRESHOLD) {
      await this.notifyDataProtectionAuthorities(notification);
    }

    // 4. Prepare user notifications
    await this.prepareUserNotifications(breach.affectedUsers);

    // 5. Document for compliance
    await this.documentBreach(breach);
  }
}
```

### Age Verification System

```typescript
class AgeVerificationGateway {
  static async verifyAge(userData: UserRegistrationData): Promise<AgeVerification> {
    // 1. Self-declaration with confirmation
    const declaredAge = await this.getAgDeclaration(userData);

    // 2. Determine verification requirements by jurisdiction
    const requirements = this.getJurisdictionRequirements(userData.country);

    // 3. Apply appropriate verification
    if (declaredAge < requirements.digitalConsentAge) {
      return await this.requireParentalConsent(userData, declaredAge);
    } else if (declaredAge < 18) {
      return await this.verifyWithLimitedData(userData, declaredAge);
    } else {
      return await this.standardVerification(userData);
    }
  }

  private static getJurisdictionRequirements(country: string): JurisdictionRequirements {
    const requirements = {
      US: { digitalConsentAge: 13, parentalConsentRequired: true },
      DE: { digitalConsentAge: 16, parentalConsentRequired: true },
      UK: { digitalConsentAge: 13, parentalConsentRequired: true },
      BR: { digitalConsentAge: 18, parentalConsentRequired: true },
      IN: { digitalConsentAge: 18, parentalConsentRequired: true },
      CH: { digitalConsentAge: 16, parentalConsentRequired: true },
      // ... other countries
    };

    return requirements[country] || { digitalConsentAge: 16, parentalConsentRequired: true };
  }
}
```

### Monitoring and Compliance Dashboard

```typescript
// Real-time compliance monitoring
class ComplianceDashboard {
  static async getComplianceMetrics(): Promise<ComplianceMetrics> {
    return {
      gdpr: {
        activeConsents: await this.countActiveConsents('EU'),
        pendingDSRs: await this.countPendingDSRs('EU'),
        avgDSRCompletionTime: await this.calculateDSRCompletionTime('EU'),
        dataBreaches90Days: await this.countRecentBreaches(90),
      },
      coppa: {
        verifiedParents: await this.countVerifiedParents('US'),
        childAccounts: await this.countChildAccounts('US'),
        parentalConsentRate: await this.calculateConsentRate('US'),
      },
      global: {
        encryptionCoverage: await this.calculateEncryptionCoverage(),
        auditCompleteness: await this.calculateAuditCompleteness(),
        retentionCompliance: await this.checkRetentionCompliance(),
      },
    };
  }
}
```

## Implementation Priorities

### Phase 1: Foundation (Critical)

1. **Age verification gateway** - Must be in place before any data collection
2. **Consent management system** - Required for lawful processing
3. **Encryption infrastructure** - Field-level encryption for PII
4. **Basic DSR handling** - Manual process acceptable initially

### Phase 2: Automation (High Priority)

1. **Automated DSR responses** - Scale requirement
2. **Breach detection system** - 72-hour notification requirement
3. **Consent preference center** - User self-service
4. **Audit trail system** - Compliance evidence

### Phase 3: Enhancement (Medium Priority)

1. **Multi-regional data residency** - Performance and compliance
2. **Advanced parental controls** - Competitive advantage
3. **Compliance reporting** - Regulatory relationships
4. **Third-party integration controls** - Ecosystem growth

## Additional Architectural Considerations

### 1. API Design for Compliance

```typescript
// Privacy-first API design
@Controller('api/v1')
export class PrivacyFirstAPI {
  @Get('/users/:id')
  @RequireConsent(['data_access'])
  @AuditAccess('user_profile_view')
  @MinimizeData() // Return only necessary fields
  async getUser(@Param('id') id: string, @User() requester: AuthUser) {
    // Verify access rights
    if (!this.canAccessUser(requester, id)) {
      throw new ForbiddenException();
    }

    // Return minimized data set
    return this.userService.getMinimalProfile(id);
  }

  @Post('/children')
  @RequireParentAuth()
  @RequireConsent(['child_account_creation'])
  @ValidateAge()
  async createChild(@Body() data: CreateChildDto, @User() parent: AuthUser) {
    // Verify parent status
    const parentVerified = await this.verifyParentStatus(parent.id);
    if (!parentVerified) {
      throw new UnauthorizedException('Parent verification required');
    }

    // Create with privacy defaults
    return this.childService.createWithPrivacyDefaults(data, parent.id);
  }
}
```

### 2. Privacy-Preserving Analytics

```typescript
// Analytics without compromising privacy
class PrivacyAnalytics {
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    // No tracking for children under 13
    if (event.userAge < 13) {
      return;
    }

    // Anonymize data
    const anonymized = {
      eventType: event.type,
      timestamp: this.fuzzyTimestamp(event.timestamp),
      ageGroup: this.getAgeGroup(event.userAge),
      region: this.getRegion(event.country),
      // No user IDs or identifying information
    };

    await this.analyticsProvider.track(anonymized);
  }

  private static fuzzyTimestamp(exact: Date): Date {
    // Round to nearest hour for privacy
    const rounded = new Date(exact);
    rounded.setMinutes(0, 0, 0);
    return rounded;
  }
}
```

### 3. Infrastructure Security

```yaml
# Kubernetes security policies for compliance
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT # All inter-service communication encrypted

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  # Whitelist specific services only

---
apiVersion: v1
kind: Secret
metadata:
  name: encryption-keys
  annotations:
    vault.hashicorp.com/role: 'taschengeld-app'
    vault.hashicorp.com/agent-inject: 'true'
```

### 4. Compliance Testing

```typescript
// Automated compliance testing
describe('GDPR Compliance Tests', () => {
  test('Data export includes all user data', async () => {
    const userId = await createTestUser();
    await createTestData(userId);

    const export = await DataSubjectRightsEngine.handleAccessRequest(userId);

    expect(export).toContainAllUserData();
    expect(export.format).toBe('JSON');
    expect(export).toBePortable();
  });

  test('Deletion request removes all data', async () => {
    const userId = await createTestUser();
    await createTestData(userId);

    await DataSubjectRightsEngine.handleDeletionRequest(userId, 'SELF');

    const remainingData = await findAllUserData(userId);
    expect(remainingData).toBeEmpty();
  });

  test('Child account requires parental consent', async () => {
    const parentId = await createTestParent();

    await expect(
      createChildAccount({ parentId, age: 10 })
    ).rejects.toThrow('Parental consent required');

    await provideParentalConsent(parentId);

    const child = await createChildAccount({ parentId, age: 10 });
    expect(child).toBeDefined();
  });
});
```

## Risk Mitigation Strategies

### Compliance Risks

1. **Cross-border data transfers**

   - **Risk**: Swiss to US data transfers
   - **Mitigation**: Implement SCCs, use Swiss/EU data centers primarily

2. **Age verification accuracy**

   - **Risk**: Children lying about age
   - **Mitigation**: Multi-step verification, parental involvement for features

3. **Consent fatigue**

   - **Risk**: Users blindly accepting
   - **Mitigation**: Progressive consent, just-in-time requests

4. **Data breach liability**
   - **Risk**: Large fines for breaches
   - **Mitigation**: Defense in depth, encryption, rapid response plan

## Compliance Checklist

### Pre-Launch Requirements

- [ ] Privacy Policy (multi-language)
- [ ] Terms of Service (child-appropriate versions)
- [ ] Cookie Policy and consent banner
- [ ] Data Processing Agreements (DPAs) with vendors
- [ ] Privacy Impact Assessment (PIA/DPIA)
- [ ] Incident Response Plan
- [ ] Employee privacy training
- [ ] Compliance audit trail system

### Ongoing Compliance

- [ ] Monthly compliance metrics review
- [ ] Quarterly privacy assessments
- [ ] Annual security audits
- [ ] Regular policy updates
- [ ] Vendor compliance monitoring
- [ ] Regulatory change tracking

## Conclusion

Building GDPR, COPPA, and global privacy compliance into the architecture from day one is essential for Taschengeld SaaS. The key architectural decisions are:

1. **Privacy by Design**: Every feature considers privacy implications
2. **Age-Appropriate Design**: Different experiences for different age groups
3. **Consent Management**: Granular, withdrawable, and auditable
4. **Data Minimization**: Collect only what's necessary
5. **Security First**: Encryption, access controls, and monitoring
6. **Transparency**: Clear data handling and user rights

These requirements significantly impact our architecture but provide a competitive advantage by building trust with parents and ensuring long-term sustainability of the platform.

---

**Next Steps**:

1. Implement age verification gateway before any data collection
2. Build consent management system with parent-child relationships
3. Design privacy-first database schema with encryption
4. Create DSR handling procedures
5. Establish compliance monitoring and reporting
