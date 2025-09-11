import { randomBytes, createHash } from 'crypto';

import { NextRequest } from 'next/server';

import bcrypt from 'bcryptjs';

import { JWTManager, JWTPayload } from './auth/jwt-manager';
import { rateLimit, RateLimitPresets } from './rate-limit';

export interface AuthResult {
  success: boolean
  user?: {
    id: string
    email: string
    role: string
    permissions: string[]
    sessionId: string
  }
  error?: string
  requiresMFA?: boolean
  mfaToken?: string
}

export interface User {
  id: string
  email: string
  passwordHash: string
  role: string
  permissions: string[]
  isActive: boolean
  isEmailVerified: boolean
  mfaEnabled: boolean
  mfaSecret?: string
  lastLoginAt?: Date
  failedLoginAttempts: number
  lockedUntil?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  emailVerificationToken?: string
  profileData?: {
    firstName?: string
    lastName?: string
    company?: string
    phone?: string
    avatar?: string
  }
  securitySettings?: {
    requireMFA: boolean
    allowedIPAddresses?: string[]
    sessionTimeoutMinutes: number
    requireStrongPassword: boolean
  }
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface AuthConfig {
  jwtManager: JWTManager
  maxFailedAttempts: number
  lockoutDurationMinutes: number
  passwordMinLength: number
  requireStrongPasswords: boolean
  enableMFA: boolean
  sessionTimeoutMinutes: number
  allowMultipleSessions: boolean
  requireEmailVerification: boolean
}

// Mock user store - in production, this would be a database
const userStore = new Map<string, User>();

// Initialize JWT manager
const jwtManager = new JWTManager({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  issuer: 'litong-electronics',
  audience: 'litong-app',
  algorithm: 'HS256',
  enableRefreshTokenRotation: true,
  maxRefreshTokens: 5
});

const authConfig: AuthConfig = {
  jwtManager,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 30,
  passwordMinLength: 8,
  requireStrongPasswords: true,
  enableMFA: false, // Can be enabled per user
  sessionTimeoutMinutes: 480, // 8 hours
  allowMultipleSessions: true,
  requireEmailVerification: true
};

/**
 * Authenticate a request using JWT token
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return {
        success: false,
        error: 'No authentication token provided'
      };
    }

    // Verify and decode token
    const payload = await authConfig.jwtManager.verifyAccessToken(token);
    if (!payload) {
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }

    // Get user details
    const user = await getUserById(payload.userId);
    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'User not found or inactive'
      };
    }

    // Check if user account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return {
        success: false,
        error: 'Account is temporarily locked'
      };
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await updateUser(user.id, { lastLoginAt: user.lastLoginAt });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        sessionId: payload.sessionId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

/**
 * Login with email and password
 */
export async function loginUser(
  email: string,
  password: string,
  deviceInfo?: {
    deviceId?: string
    ipAddress?: string
    userAgent?: string
  }
): Promise<AuthResult & { tokens?: { accessToken: string; refreshToken: string } }> {
  try {
    // Rate limiting for login attempts
    const mockRequest = {
      headers: new Map([['x-forwarded-for', deviceInfo?.ipAddress || '127.0.0.1']]),
      ip: deviceInfo?.ipAddress
    } as any;

    const rateLimitResult = await rateLimit(mockRequest, RateLimitPresets.LOGIN_ATTEMPTS);
    if (!rateLimitResult.success) {
      return {
        success: false,
        error: 'Too many login attempts. Please try again later.'
      };
    }

    // Find user by email
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return {
        success: false,
        error: `Account is locked. Try again in ${lockTimeRemaining} minutes.`
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account if max attempts reached
      if (user.failedLoginAttempts >= authConfig.maxFailedAttempts) {
        user.lockedUntil = new Date(Date.now() + authConfig.lockoutDurationMinutes * 60000);
      }

      await updateUser(user.id, {
        failedLoginAttempts: user.failedLoginAttempts,
        lockedUntil: user.lockedUntil
      });

      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Check if email is verified (if required)
    if (authConfig.requireEmailVerification && !user.isEmailVerified) {
      return {
        success: false,
        error: 'Please verify your email address before logging in'
      };
    }

    // Reset failed login attempts on successful password verification
    if (user.failedLoginAttempts > 0) {
      await updateUser(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null
      });
    }

    // Check if MFA is enabled for the user
    if (user.mfaEnabled) {
      // Generate MFA token (would implement TOTP verification)
      const mfaToken = generateMFAToken();

      // Store MFA token temporarily (in production, use secure cache)
      // This is just for demo - real implementation would use TOTP

      return {
        success: false,
        requiresMFA: true,
        mfaToken,
        error: 'MFA verification required'
      };
    }

    // Generate JWT tokens
    const sessionId = authConfig.jwtManager.generateSessionId();
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'> = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      sessionId,
      deviceId: deviceInfo?.deviceId,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent
    };

    const tokens = await authConfig.jwtManager.generateTokenPair(tokenPayload);

    // Update user's last login info
    await updateUser(user.id, {
      lastLoginAt: new Date()
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        sessionId
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
}

/**
 * Register a new user
 */
export async function registerUser(userData: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  company?: string
  role?: string
}): Promise<AuthResult> {
  try {
    const { email, password, firstName, lastName, company, role = 'customer' } = userData;

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email.toLowerCase().trim());
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors.join(', ')
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = authConfig.requireEmailVerification
      ? generateSecureToken()
      : undefined;

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      permissions: getRolePermissions(role),
      isActive: true,
      isEmailVerified: !authConfig.requireEmailVerification,
      mfaEnabled: false,
      failedLoginAttempts: 0,
      emailVerificationToken,
      profileData: {
        firstName,
        lastName,
        company
      },
      securitySettings: {
        requireMFA: false,
        sessionTimeoutMinutes: authConfig.sessionTimeoutMinutes,
        requireStrongPassword: authConfig.requireStrongPasswords
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store user
    await createUser(newUser);

    // Send email verification if required
    if (authConfig.requireEmailVerification && emailVerificationToken) {
      // In production, send email with verification link
      console.log(`Email verification token for ${email}: ${emailVerificationToken}`);
    }

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        sessionId: ''
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
}

/**
 * Refresh authentication tokens
 */
export async function refreshAuthTokens(
  refreshToken: string,
  deviceInfo?: {
    deviceId?: string
    ipAddress?: string
    userAgent?: string
  }
): Promise<{ success: boolean; tokens?: { accessToken: string; refreshToken: string }; error?: string }> {
  try {
    const newTokens = await authConfig.jwtManager.refreshTokenPair(refreshToken, deviceInfo);

    if (!newTokens) {
      return {
        success: false,
        error: 'Invalid or expired refresh token'
      };
    }

    return {
      success: true,
      tokens: newTokens
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token refresh failed'
    };
  }
}

/**
 * Logout user (revoke tokens)
 */
export async function logoutUser(refreshToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Decode refresh token to get token ID
    const decoded = authConfig.jwtManager.decodeTokenWithoutVerification(refreshToken);
    if (decoded?.jti) {
      await authConfig.jwtManager.revokeRefreshToken(decoded.jti);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed'
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidCurrentPassword) {
      return {
        success: false,
        error: 'Current password is incorrect'
      };
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors.join(', ')
      };
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    await updateUser(userId, {
      passwordHash: newPasswordHash,
      updatedAt: new Date()
    });

    // Revoke all existing tokens for security
    await authConfig.jwtManager.revokeAllUserTokens(userId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password change failed'
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      // Don't reveal if email exists or not
      return { success: true };
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await updateUser(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires
    });

    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password reset request failed'
    };
  }
}

// Utility functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < authConfig.passwordMinLength) {
    errors.push(`Password must be at least ${authConfig.passwordMinLength} characters long`);
  }

  if (authConfig.requireStrongPasswords) {
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function getRolePermissions(role: string): string[] {
  const rolePermissions = {
    admin: ['read:all', 'write:all', 'delete:all', 'manage:users', 'manage:system'],
    manager: ['read:all', 'write:products', 'write:orders', 'read:analytics'],
    sales: ['read:products', 'write:inquiries', 'read:customers', 'write:quotes'],
    customer: ['read:products', 'write:inquiries', 'read:own_orders']
  };

  return rolePermissions[role as keyof typeof rolePermissions] || rolePermissions.customer;
}

function generateUserId(): string {
  return `user_${Date.now()}_${randomBytes(8).toString('hex')}`;
}

function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

function generateMFAToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock database functions - replace with actual database implementation
async function createUser(user: User): Promise<void> {
  userStore.set(user.id, user);
}

async function getUserById(id: string): Promise<User | null> {
  return userStore.get(id) || null;
}

async function getUserByEmail(email: string): Promise<User | null> {
  for (const user of userStore.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  const user = userStore.get(id);
  if (user) {
    Object.assign(user, updates);
    user.updatedAt = new Date();
    userStore.set(id, user);
  }
}

// Permission checking utilities
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('read:all') || userPermissions.includes('write:all');
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission));
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission));
}

export function isAdmin(userRole: string): boolean {
  return userRole === 'admin';
}

export function isManager(userRole: string): boolean {
  return userRole === 'manager' || userRole === 'admin';
}

// Export JWT manager for direct use
export { jwtManager };
