import { createHash, randomBytes } from 'crypto';

import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
  sessionId: string
  deviceId?: string
  ipAddress?: string
  userAgent?: string
  iat?: number
  exp?: number
  jti?: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

export interface JWTConfig {
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiry: string | number
  refreshTokenExpiry: string | number
  issuer: string
  audience: string
  algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512'
  enableRefreshTokenRotation: boolean
  maxRefreshTokens: number
}

export interface RefreshTokenRecord {
  tokenId: string
  userId: string
  hashedToken: string
  expiresAt: Date
  isRevoked: boolean
  deviceId?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  lastUsedAt: Date
  parentTokenId?: string
}

export class JWTManager {
  private config: JWTConfig;
  private refreshTokenStore: Map<string, RefreshTokenRecord> = new Map();

  constructor(config: JWTConfig) {
    this.config = {
      accessTokenExpiry: '15m',
      refreshTokenExpiry: '7d',
      algorithm: 'HS256',
      enableRefreshTokenRotation: true,
      maxRefreshTokens: 5,
      ...config
    };

    // Validate required config
    if (!this.config.accessTokenSecret || !this.config.refreshTokenSecret) {
      throw new Error('JWT secrets are required');
    }

    if (this.config.accessTokenSecret === this.config.refreshTokenSecret) {
      throw new Error('Access token and refresh token secrets must be different');
    }
  }

  /**
   * Generate a new token pair (access token + refresh token)
   */
  async generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>): Promise<TokenPair> {
    const jti = this.generateTokenId();
    const now = Math.floor(Date.now() / 1000);

    // Create access token
    const accessTokenPayload: JWTPayload = {
      ...payload,
      iat: now,
      jti
    };

    const accessToken = jwt.sign(accessTokenPayload, this.config.accessTokenSecret, {
      expiresIn: this.config.accessTokenExpiry,
      issuer: this.config.issuer,
      audience: this.config.audience,
      algorithm: this.config.algorithm
    });

    // Create refresh token
    const refreshTokenPayload = {
      userId: payload.userId,
      sessionId: payload.sessionId,
      type: 'refresh',
      jti: this.generateTokenId(),
      iat: now
    };

    const refreshToken = jwt.sign(refreshTokenPayload, this.config.refreshTokenSecret, {
      expiresIn: this.config.refreshTokenExpiry,
      issuer: this.config.issuer,
      audience: this.config.audience,
      algorithm: this.config.algorithm
    });

    // Store refresh token record
    await this.storeRefreshToken(refreshTokenPayload.jti, {
      tokenId: refreshTokenPayload.jti,
      userId: payload.userId,
      hashedToken: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + this.parseExpiry(this.config.refreshTokenExpiry)),
      isRevoked: false,
      deviceId: payload.deviceId,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
      createdAt: new Date(),
      lastUsedAt: new Date()
    });

    // Clean up old refresh tokens for this user
    await this.cleanupOldRefreshTokens(payload.userId);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiry(this.config.accessTokenExpiry) / 1000,
      refreshExpiresIn: this.parseExpiry(this.config.refreshTokenExpiry) / 1000
    };
  }

  /**
   * Verify and decode an access token
   */
  async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.verify(token, this.config.accessTokenSecret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithms: [this.config.algorithm]
      }) as JWTPayload;

      // Additional security checks
      if (!decoded.userId || !decoded.sessionId) {
        return null;
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.log('JWT verification failed:', error.message);
      }
      return null;
    }
  }

  /**
   * Verify refresh token and generate new token pair
   */
  async refreshTokenPair(refreshToken: string, deviceInfo?: {
    deviceId?: string
    ipAddress?: string
    userAgent?: string
  }): Promise<TokenPair | null> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.config.refreshTokenSecret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithms: [this.config.algorithm]
      }) as any;

      if (decoded.type !== 'refresh' || !decoded.jti || !decoded.userId) {
        return null;
      }

      // Check if refresh token exists and is valid
      const tokenRecord = await this.getRefreshToken(decoded.jti);
      if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
        return null;
      }

      // Verify token hash
      const hashedToken = this.hashToken(refreshToken);
      if (tokenRecord.hashedToken !== hashedToken) {
        // Potential token theft - revoke all tokens for this user
        await this.revokeAllUserTokens(decoded.userId);
        return null;
      }

      // Security check - verify device/IP if provided
      if (deviceInfo && this.shouldVerifyDevice(tokenRecord, deviceInfo)) {
        // Device mismatch - could be token theft
        await this.revokeRefreshToken(decoded.jti);
        return null;
      }

      // Update last used time
      tokenRecord.lastUsedAt = new Date();
      await this.updateRefreshToken(decoded.jti, tokenRecord);

      // Generate new token pair
      const userPayload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'> = {
        userId: decoded.userId,
        email: tokenRecord.email || '', // Would need to fetch from user store
        role: tokenRecord.role || 'user', // Would need to fetch from user store
        permissions: tokenRecord.permissions || [], // Would need to fetch from user store
        sessionId: decoded.sessionId,
        deviceId: deviceInfo?.deviceId || tokenRecord.deviceId,
        ipAddress: deviceInfo?.ipAddress || tokenRecord.ipAddress,
        userAgent: deviceInfo?.userAgent || tokenRecord.userAgent
      };

      const newTokenPair = await this.generateTokenPair(userPayload);

      // If rotation is enabled, revoke old refresh token
      if (this.config.enableRefreshTokenRotation) {
        await this.revokeRefreshToken(decoded.jti);
      }

      return newTokenPair;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.log('Refresh token verification failed:', error.message);
      }
      return null;
    }
  }

  /**
   * Revoke a specific refresh token
   */
  async revokeRefreshToken(tokenId: string): Promise<boolean> {
    const tokenRecord = await this.getRefreshToken(tokenId);
    if (!tokenRecord) {
      return false;
    }

    tokenRecord.isRevoked = true;
    await this.updateRefreshToken(tokenId, tokenRecord);
    return true;
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<number> {
    let revokedCount = 0;

    for (const [tokenId, record] of this.refreshTokenStore.entries()) {
      if (record.userId === userId && !record.isRevoked) {
        record.isRevoked = true;
        await this.updateRefreshToken(tokenId, record);
        revokedCount++;
      }
    }

    return revokedCount;
  }

  /**
   * Revoke all refresh tokens for a session
   */
  async revokeSessionTokens(sessionId: string): Promise<number> {
    const revokedCount = 0;

    // This would need to be implemented based on your session storage
    // For now, we'll just revoke based on token records

    return revokedCount;
  }

  /**
   * Get all active refresh tokens for a user
   */
  async getUserRefreshTokens(userId: string): Promise<RefreshTokenRecord[]> {
    const userTokens: RefreshTokenRecord[] = [];

    for (const [, record] of this.refreshTokenStore.entries()) {
      if (record.userId === userId && !record.isRevoked && record.expiresAt > new Date()) {
        userTokens.push(record);
      }
    }

    return userTokens.sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime());
  }

  /**
   * Validate token format and extract basic info without verification
   */
  decodeTokenWithoutVerification(token: string): any {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }

  /**
   * Check if a token is expired (without verification)
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeTokenWithoutVerification(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    return decoded.exp < Math.floor(Date.now() / 1000);
  }

  /**
   * Generate a secure session ID
   */
  generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generate a device fingerprint
   */
  generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    return createHash('sha256')
      .update(`${userAgent}:${ipAddress}`)
      .digest('hex')
      .substring(0, 16);
  }

  // Private methods
  private generateTokenId(): string {
    return randomBytes(16).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseExpiry(expiry: string | number): number {
    if (typeof expiry === 'number') {
      return expiry * 1000; // Convert seconds to milliseconds
    }

    // Parse string expiry like '15m', '7d', '1h'
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiry format: ${expiry}`);
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
    };

    return value * multipliers[unit as keyof typeof multipliers];
  }

  private shouldVerifyDevice(tokenRecord: RefreshTokenRecord, deviceInfo: {
    deviceId?: string
    ipAddress?: string
    userAgent?: string
  }): boolean {
    // Implement device verification logic
    // This could include checking for significant changes in device fingerprint
    return false; // Placeholder
  }

  private async storeRefreshToken(tokenId: string, record: RefreshTokenRecord): Promise<void> {
    // In a real implementation, this would store in a database
    this.refreshTokenStore.set(tokenId, record);
  }

  private async getRefreshToken(tokenId: string): Promise<RefreshTokenRecord | null> {
    // In a real implementation, this would fetch from a database
    return this.refreshTokenStore.get(tokenId) || null;
  }

  private async updateRefreshToken(tokenId: string, record: RefreshTokenRecord): Promise<void> {
    // In a real implementation, this would update in a database
    this.refreshTokenStore.set(tokenId, record);
  }

  private async cleanupOldRefreshTokens(userId: string): Promise<void> {
    const userTokens = await this.getUserRefreshTokens(userId);

    // If user has more than max allowed tokens, revoke the oldest ones
    if (userTokens.length >= this.config.maxRefreshTokens) {
      const tokensToRevoke = userTokens
        .sort((a, b) => a.lastUsedAt.getTime() - b.lastUsedAt.getTime())
        .slice(0, userTokens.length - this.config.maxRefreshTokens + 1);

      for (const token of tokensToRevoke) {
        await this.revokeRefreshToken(token.tokenId);
      }
    }

    // Clean up expired tokens
    for (const [tokenId, record] of this.refreshTokenStore.entries()) {
      if (record.expiresAt < new Date()) {
        this.refreshTokenStore.delete(tokenId);
      }
    }
  }

  // Public utility methods
  public getTokenInfo(token: string): {
    isValid: boolean
    isExpired: boolean
    payload?: any
    error?: string
  } {
    try {
      const payload = this.decodeTokenWithoutVerification(token);
      if (!payload) {
        return { isValid: false, isExpired: true, error: 'Invalid token format' };
      }

      const isExpired = this.isTokenExpired(token);
      return {
        isValid: true,
        isExpired,
        payload
      };
    } catch (error) {
      return {
        isValid: false,
        isExpired: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public getRefreshTokenStats(userId: string): Promise<{
    totalTokens: number
    activeTokens: number
    expiredTokens: number
    revokedTokens: number
    lastUsed: Date | null
  }> {
    let totalTokens = 0;
    let activeTokens = 0;
    let expiredTokens = 0;
    let revokedTokens = 0;
    let lastUsed: Date | null = null;

    for (const [, record] of this.refreshTokenStore.entries()) {
      if (record.userId === userId) {
        totalTokens++;

        if (record.isRevoked) {
          revokedTokens++;
        } else if (record.expiresAt < new Date()) {
          expiredTokens++;
        } else {
          activeTokens++;
        }

        if (!lastUsed || record.lastUsedAt > lastUsed) {
          lastUsed = record.lastUsedAt;
        }
      }
    }

    return Promise.resolve({
      totalTokens,
      activeTokens,
      expiredTokens,
      revokedTokens,
      lastUsed
    });
  }
}
