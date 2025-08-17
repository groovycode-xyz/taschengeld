# Authentication Strategy for Taschengeld SaaS

**Document Version**: 1.0  
**Date**: 2025-07-08  
**Status**: Planning Phase

## Overview

This document outlines the authentication strategy for transforming Taschengeld from a PIN-based family application to a multi-tenant SaaS platform with proper user accounts, family management, and role-based access control.

## Current Authentication Model

### Current PIN-Based System

- **Single PIN**: One PIN for parent mode access
- **Mode Switching**: PIN toggles between parent and child modes
- **No User Accounts**: No email/password authentication
- **Local Storage**: PIN stored in app settings
- **Session Management**: Simple local state management

### Limitations for SaaS

- **No Multi-tenancy**: Cannot support multiple families
- **No User Identity**: No way to identify individual users
- **No Remote Access**: Cannot access from different devices
- **No Security**: PIN is not cryptographically secure
- **No Account Recovery**: No way to reset forgotten PIN

## New Authentication Architecture

### Multi-Layer Authentication System

```typescript
// Authentication layers
interface AuthenticationLayers {
  userAccount: UserAccount; // Primary authentication
  familyMembership: FamilyRole; // Family-specific permissions
  sessionContext: SessionData; // Current session state
  deviceTrust: DeviceTrust; // Device-specific settings
}

// User account (tenant-agnostic)
interface UserAccount {
  id: string;
  email: string;
  emailVerified: boolean;
  passwordHash?: string;
  socialProviders: SocialProvider[];
  mfaEnabled: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

// Family membership (tenant-specific)
interface FamilyRole {
  id: string;
  userAccountId: string;
  tenantId: string;
  role: 'parent' | 'child' | 'admin';
  permissions: Permission[];
  joinedAt: Date;
  invitedBy: string;
}

// Session data
interface SessionData {
  sessionId: string;
  userAccountId: string;
  tenantId: string;
  currentRole: string;
  deviceId: string;
  expiresAt: Date;
  lastActivity: Date;
}
```

### Technology Stack

#### NextAuth.js Integration

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyCredentials(credentials.email, credentials.password);
        return user ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.email = token.email;

        // Add family context if available
        const familyMembership = await getCurrentFamilyMembership(token.userId);
        if (familyMembership) {
          session.tenantId = familyMembership.tenantId;
          session.role = familyMembership.role;
        }
      }
      return session;
    },
  },
});
```

#### Custom User Management Layer

```typescript
// lib/auth/user-management.ts
export class UserManagement {
  static async registerUser(data: RegisterUserData): Promise<UserAccount> {
    // 1. Validate email format and availability
    await this.validateEmailAvailability(data.email);

    // 2. Hash password if provided
    const passwordHash = data.password ? await hashPassword(data.password) : undefined;

    // 3. Create user account
    const userAccount = await prisma.userAccount.create({
      data: {
        email: data.email,
        passwordHash,
        emailVerified: false,
      },
    });

    // 4. Send verification email
    await this.sendVerificationEmail(userAccount);

    return userAccount;
  }

  static async createFamilyMembership(
    userAccountId: string,
    tenantId: string,
    role: FamilyRole,
    invitedBy: string
  ): Promise<FamilyMembership> {
    return await prisma.familyMembership.create({
      data: {
        userAccountId,
        tenantId,
        role,
        invitedBy,
        permissions: this.getDefaultPermissions(role),
      },
    });
  }

  static async switchFamilyContext(
    userAccountId: string,
    tenantId: string
  ): Promise<FamilyMembership | null> {
    // Verify user has access to this family
    const membership = await prisma.familyMembership.findFirst({
      where: {
        userAccountId,
        tenantId,
      },
      include: {
        tenant: true,
      },
    });

    if (!membership) {
      throw new Error('User does not have access to this family');
    }

    return membership;
  }
}
```

## Family Management System

### Family Invitation Flow

```typescript
// lib/auth/family-invitations.ts
export class FamilyInvitations {
  static async inviteToFamily(
    tenantId: string,
    inviterUserId: string,
    inviteeEmail: string,
    role: 'parent' | 'child'
  ): Promise<Invitation> {
    // 1. Check inviter permissions
    const inviter = await this.validateInviterPermissions(inviterUserId, tenantId);

    // 2. Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        tenantId,
        inviterUserId,
        inviteeEmail,
        role,
        token: generateSecureToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // 3. Send invitation email
    await this.sendInvitationEmail(invitation);

    return invitation;
  }

  static async acceptInvitation(token: string, userAccountId: string): Promise<FamilyMembership> {
    // 1. Validate invitation
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        acceptedAt: null,
      },
    });

    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    // 2. Create family membership
    const membership = await UserManagement.createFamilyMembership(
      userAccountId,
      invitation.tenantId,
      invitation.role,
      invitation.inviterUserId
    );

    // 3. Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    return membership;
  }
}
```

### Role-Based Access Control

```typescript
// lib/auth/rbac.ts
export enum Permission {
  // User management
  INVITE_FAMILY_MEMBERS = 'invite_family_members',
  REMOVE_FAMILY_MEMBERS = 'remove_family_members',
  MANAGE_FAMILY_SETTINGS = 'manage_family_settings',

  // Task management
  CREATE_TASKS = 'create_tasks',
  EDIT_TASKS = 'edit_tasks',
  DELETE_TASKS = 'delete_tasks',
  COMPLETE_TASKS = 'complete_tasks',

  // Payment management
  APPROVE_PAYMENTS = 'approve_payments',
  REJECT_PAYMENTS = 'reject_payments',
  MANAGE_ALLOWANCES = 'manage_allowances',

  // Piggy bank
  VIEW_BALANCES = 'view_balances',
  ADD_FUNDS = 'add_funds',
  WITHDRAW_FUNDS = 'withdraw_funds',
  VIEW_TRANSACTIONS = 'view_transactions',

  // Subscription management
  MANAGE_SUBSCRIPTION = 'manage_subscription',
  VIEW_BILLING = 'view_billing',
}

export const ROLE_PERMISSIONS = {
  admin: [
    Permission.INVITE_FAMILY_MEMBERS,
    Permission.REMOVE_FAMILY_MEMBERS,
    Permission.MANAGE_FAMILY_SETTINGS,
    Permission.CREATE_TASKS,
    Permission.EDIT_TASKS,
    Permission.DELETE_TASKS,
    Permission.APPROVE_PAYMENTS,
    Permission.REJECT_PAYMENTS,
    Permission.MANAGE_ALLOWANCES,
    Permission.VIEW_BALANCES,
    Permission.ADD_FUNDS,
    Permission.WITHDRAW_FUNDS,
    Permission.VIEW_TRANSACTIONS,
    Permission.MANAGE_SUBSCRIPTION,
    Permission.VIEW_BILLING,
  ],
  parent: [
    Permission.INVITE_FAMILY_MEMBERS,
    Permission.MANAGE_FAMILY_SETTINGS,
    Permission.CREATE_TASKS,
    Permission.EDIT_TASKS,
    Permission.DELETE_TASKS,
    Permission.COMPLETE_TASKS,
    Permission.APPROVE_PAYMENTS,
    Permission.REJECT_PAYMENTS,
    Permission.MANAGE_ALLOWANCES,
    Permission.VIEW_BALANCES,
    Permission.ADD_FUNDS,
    Permission.WITHDRAW_FUNDS,
    Permission.VIEW_TRANSACTIONS,
  ],
  child: [Permission.COMPLETE_TASKS, Permission.VIEW_BALANCES, Permission.VIEW_TRANSACTIONS],
};

export class RoleBasedAccessControl {
  static hasPermission(role: string, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
  }

  static async validateUserPermission(
    userAccountId: string,
    tenantId: string,
    permission: Permission
  ): Promise<boolean> {
    const membership = await prisma.familyMembership.findFirst({
      where: { userAccountId, tenantId },
    });

    if (!membership) {
      return false;
    }

    return this.hasPermission(membership.role, permission);
  }
}
```

## Authentication Middleware

### API Route Protection

```typescript
// lib/middleware/auth-middleware.ts
export function withAuth(handler: AuthenticatedApiHandler, options: AuthOptions = {}): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // 1. Validate session
      const session = await getSession({ req });
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // 2. Get family context
      const tenantId = await resolveTenantId(req, session);
      if (!tenantId) {
        return res.status(403).json({ error: 'No family context' });
      }

      // 3. Validate family membership
      const membership = await validateFamilyMembership(session.user.id, tenantId);
      if (!membership) {
        return res.status(403).json({ error: 'Not a family member' });
      }

      // 4. Check required permissions
      if (options.permission) {
        const hasPermission = await RoleBasedAccessControl.validateUserPermission(
          session.user.id,
          tenantId,
          options.permission
        );

        if (!hasPermission) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      // 5. Add auth context to request
      req.auth = {
        userAccountId: session.user.id,
        tenantId,
        role: membership.role,
        permissions: membership.permissions,
      };

      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Usage in API routes
export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // Handler logic with req.auth available
  },
  { permission: Permission.CREATE_TASKS }
);
```

### Client-Side Authentication

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { data: session, status } = useSession();
  const [currentFamily, setCurrentFamily] = useState<FamilyMembership | null>(null);

  const signIn = useCallback(async (provider: string) => {
    await signIn(provider);
  }, []);

  const signOut = useCallback(async () => {
    await signOut();
    setCurrentFamily(null);
  }, []);

  const switchFamily = useCallback(async (tenantId: string) => {
    try {
      const response = await fetch('/api/auth/switch-family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });

      if (response.ok) {
        const membership = await response.json();
        setCurrentFamily(membership);
      }
    } catch (error) {
      console.error('Failed to switch family:', error);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      return currentFamily?.permissions.includes(permission) || false;
    },
    [currentFamily]
  );

  return {
    user: session?.user,
    currentFamily,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    signIn,
    signOut,
    switchFamily,
    hasPermission,
  };
}
```

## Multi-Factor Authentication

### TOTP Implementation

```typescript
// lib/auth/mfa.ts
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export class MFAManager {
  static async setupMFA(userAccountId: string): Promise<MFASetup> {
    const user = await prisma.userAccount.findUnique({
      where: { id: userAccountId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate secret
    const secret = authenticator.generateSecret();

    // Create service name
    const serviceName = 'Taschengeld';
    const accountName = user.email;

    // Generate key URI
    const keyUri = authenticator.keyuri(accountName, serviceName, secret);

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(keyUri);

    // Store secret (encrypted)
    await prisma.userAccount.update({
      where: { id: userAccountId },
      data: {
        mfaSecret: encrypt(secret),
        mfaEnabled: false, // Enable after verification
      },
    });

    return {
      secret,
      qrCodeUrl,
      backupCodes: this.generateBackupCodes(),
    };
  }

  static async verifyMFAToken(userAccountId: string, token: string): Promise<boolean> {
    const user = await prisma.userAccount.findUnique({
      where: { id: userAccountId },
    });

    if (!user?.mfaSecret) {
      return false;
    }

    const secret = decrypt(user.mfaSecret);
    return authenticator.verify({ token, secret });
  }

  static async enableMFA(userAccountId: string, token: string): Promise<boolean> {
    const isValid = await this.verifyMFAToken(userAccountId, token);

    if (isValid) {
      await prisma.userAccount.update({
        where: { id: userAccountId },
        data: { mfaEnabled: true },
      });
    }

    return isValid;
  }
}
```

## Device Trust Management

### Device Registration

```typescript
// lib/auth/device-trust.ts
export class DeviceTrustManager {
  static async registerDevice(
    userAccountId: string,
    deviceInfo: DeviceInfo
  ): Promise<TrustedDevice> {
    const deviceFingerprint = await this.generateDeviceFingerprint(deviceInfo);

    const trustedDevice = await prisma.trustedDevice.create({
      data: {
        userAccountId,
        deviceFingerprint,
        deviceName: deviceInfo.name,
        deviceType: deviceInfo.type,
        userAgent: deviceInfo.userAgent,
        ipAddress: deviceInfo.ipAddress,
        location: deviceInfo.location,
        lastUsed: new Date(),
      },
    });

    return trustedDevice;
  }

  static async verifyDevice(userAccountId: string, deviceInfo: DeviceInfo): Promise<boolean> {
    const deviceFingerprint = await this.generateDeviceFingerprint(deviceInfo);

    const trustedDevice = await prisma.trustedDevice.findFirst({
      where: {
        userAccountId,
        deviceFingerprint,
      },
    });

    if (trustedDevice) {
      // Update last used
      await prisma.trustedDevice.update({
        where: { id: trustedDevice.id },
        data: { lastUsed: new Date() },
      });

      return true;
    }

    return false;
  }

  private static async generateDeviceFingerprint(deviceInfo: DeviceInfo): Promise<string> {
    const data = `${deviceInfo.userAgent}:${deviceInfo.screenResolution}:${deviceInfo.timezone}`;
    return await hash(data);
  }
}
```

## Migration from PIN System

### Migration Strategy

```typescript
// lib/auth/migration.ts
export class PINMigrationManager {
  static async migratePINUsers(dockerData: DockerUserData): Promise<MigrationResult> {
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

      // 2. Create primary parent account
      const primaryUser = await tx.userAccount.create({
        data: {
          email: dockerData.migrationEmail,
          emailVerified: true,
          createdAt: new Date(),
        },
      });

      // 3. Create family membership
      const membership = await tx.familyMembership.create({
        data: {
          userAccountId: primaryUser.id,
          tenantId: tenant.id,
          role: 'parent',
          permissions: ROLE_PERMISSIONS.parent,
          isAdmin: true,
        },
      });

      // 4. Migrate existing data with tenant association
      await this.migrateExistingData(tx, tenant.id, dockerData);

      // 5. Create migration record
      await tx.migrationRecord.create({
        data: {
          tenantId: tenant.id,
          userAccountId: primaryUser.id,
          migrationDate: new Date(),
          sourceType: 'docker_pin',
          migrationData: dockerData,
        },
      });

      return {
        tenant,
        primaryUser,
        membership,
        migrationToken: generateMigrationToken(primaryUser.id),
      };
    });

    return transaction;
  }

  static async completeMigration(
    migrationToken: string,
    setupData: MigrationSetupData
  ): Promise<void> {
    const userAccountId = verifyMigrationToken(migrationToken);

    // Set up password if provided
    if (setupData.password) {
      await prisma.userAccount.update({
        where: { id: userAccountId },
        data: {
          passwordHash: await hashPassword(setupData.password),
        },
      });
    }

    // Set up MFA if requested
    if (setupData.enableMFA) {
      await MFAManager.setupMFA(userAccountId);
    }

    // Send welcome email
    await this.sendWelcomeEmail(userAccountId);
  }
}
```

## Security Considerations

### Password Security

```typescript
// lib/auth/password-security.ts
export class PasswordSecurity {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static validatePasswordStrength(password: string): PasswordValidation {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid =
      password.length >= minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars;

    return {
      isValid,
      score: this.calculatePasswordScore(password),
      suggestions: this.generatePasswordSuggestions(password),
    };
  }
}
```

### Session Security

```typescript
// lib/auth/session-security.ts
export class SessionSecurity {
  static async createSecureSession(
    userAccountId: string,
    tenantId: string,
    deviceInfo: DeviceInfo
  ): Promise<SecureSession> {
    const sessionId = generateSecureId();
    const deviceId = await DeviceTrustManager.generateDeviceId(deviceInfo);

    const session = await prisma.session.create({
      data: {
        id: sessionId,
        userAccountId,
        tenantId,
        deviceId,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lastActivity: new Date(),
      },
    });

    return session;
  }

  static async validateSession(sessionId: string): Promise<SecureSession | null> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        userAccount: true,
        tenant: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() },
    });

    return session;
  }

  static async revokeSession(sessionId: string): Promise<void> {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  }

  static async revokeAllUserSessions(userAccountId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userAccountId },
    });
  }
}
```

## Testing Strategy

### Authentication Tests

```typescript
// __tests__/auth/authentication.test.ts
describe('Authentication System', () => {
  describe('User Registration', () => {
    it('should create user account with email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      const user = await UserManagement.registerUser(userData);

      expect(user.email).toBe(userData.email);
      expect(user.emailVerified).toBe(false);
      expect(user.passwordHash).toBeDefined();
    });

    it('should reject duplicate email addresses', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      await UserManagement.registerUser(userData);

      await expect(UserManagement.registerUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('Family Management', () => {
    it('should create family membership', async () => {
      const user = await createTestUser();
      const tenant = await createTestTenant();

      const membership = await UserManagement.createFamilyMembership(
        user.id,
        tenant.id,
        'parent',
        user.id
      );

      expect(membership.role).toBe('parent');
      expect(membership.tenantId).toBe(tenant.id);
    });
  });
});
```

### Role-Based Access Control Tests

```typescript
// __tests__/auth/rbac.test.ts
describe('Role-Based Access Control', () => {
  it('should grant parent permissions', () => {
    const hasPermission = RoleBasedAccessControl.hasPermission('parent', Permission.CREATE_TASKS);

    expect(hasPermission).toBe(true);
  });

  it('should deny child admin permissions', () => {
    const hasPermission = RoleBasedAccessControl.hasPermission(
      'child',
      Permission.MANAGE_SUBSCRIPTION
    );

    expect(hasPermission).toBe(false);
  });
});
```

## Implementation Timeline

### Phase 1: Core Authentication (Weeks 1-2)

- NextAuth.js setup with providers
- User account creation and management
- Basic session management
- Password security implementation

### Phase 2: Family Management (Weeks 3-4)

- Family membership system
- Role-based permissions
- Invitation system
- Family switching functionality

### Phase 3: Enhanced Security (Weeks 5-6)

- Multi-factor authentication
- Device trust management
- Session security enhancements
- Password strength validation

### Phase 4: Migration & Testing (Weeks 7-8)

- PIN system migration tools
- Comprehensive test suite
- Security audit
- Performance optimization

## Conclusion

This authentication strategy provides a comprehensive foundation for the Taschengeld SaaS transformation. The multi-layer approach ensures security while maintaining the family-friendly experience through:

1. **User Account Management**: Email-based authentication with social login options
2. **Family Management**: Invitation-based family membership with role-based access
3. **Enhanced Security**: MFA, device trust, and secure session management
4. **Smooth Migration**: Tools to migrate from PIN-based to account-based authentication

The implementation maintains backward compatibility while providing the scalability and security required for a multi-tenant SaaS platform.

---

**Next Steps**:

1. Implement NextAuth.js configuration
2. Create family management system
3. Develop role-based access control
4. Set up migration tools for existing users
5. Implement comprehensive security measures
