# Security Standards (NIST-Aligned)

## Overview

This document defines security standards for all projects, aligned with the NIST Cybersecurity Framework and NIST Special Publications.

## NIST Framework Alignment

### 1. IDENTIFY

**Asset Inventory**
- Document all application components
- List all dependencies and versions
- Identify data types and sensitivity levels
- Map data flows

**Risk Assessment**
- Identify potential threats
- Assess vulnerability impact
- Prioritize security controls
- Document risk acceptance

### 2. PROTECT

**Access Control**
- Implement least privilege principle
- Use role-based access control (RBAC)
- Enforce strong authentication
- Implement session management

**Data Security**
- Encrypt sensitive data at rest
- Encrypt data in transit (TLS 1.2+)
- Implement secure data deletion
- Protect against data leakage

**Secure Development**
- Follow secure coding practices
- Conduct code reviews
- Use static analysis tools
- Implement dependency scanning

### 3. DETECT

**Monitoring**
- Log security events
- Monitor for anomalies
- Track failed login attempts
- Alert on suspicious activity

**Vulnerability Management**
- Regular dependency updates
- Security scanning in CI/CD
- Penetration testing (annual)
- Bug bounty program (optional)

### 4. RESPOND

**Incident Response**
- Document incident response plan
- Define escalation procedures
- Maintain incident log
- Conduct post-incident reviews

**Communication**
- Notify affected users
- Coordinate with security team
- Document lessons learned
- Update security controls

### 5. RECOVER

**Backup & Recovery**
- Regular automated backups
- Test recovery procedures
- Document recovery time objectives
- Maintain business continuity plan

## Password Security (NIST SP 800-63B)

### Password Requirements

**Minimum Length**: 8 characters (recommend 12+)

**Complexity**: 
- ❌ NO arbitrary complexity requirements
- ✅ Allow all printable ASCII characters
- ✅ Allow Unicode characters
- ✅ Allow spaces

**Prohibited Passwords**:
- Check against breached password databases (Have I Been Pwned API)
- Reject common passwords (top 10,000 list)
- Reject dictionary words
- Reject repetitive patterns

**Example Implementation**:
```typescript
import { pwnedPassword } from 'hibp';

async function validatePassword(password: string): Promise<boolean> {
    // Minimum length
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }
    
    // Check against breached passwords
    const pwnedCount = await pwnedPassword(password);
    if (pwnedCount > 0) {
        throw new Error('Password has been compromised in a data breach');
    }
    
    return true;
}
```

### Password Storage

**Use Strong Hashing**:
- ✅ Argon2id (recommended)
- ✅ scrypt
- ✅ bcrypt
- ❌ SHA-256 (not sufficient alone)
- ❌ MD5 (never use)

**Example with bcrypt**:
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
```

### Password Reset

**Secure Reset Flow**:
1. User requests reset via email
2. Generate cryptographically random token
3. Store token hash with expiration (15 minutes)
4. Send reset link to verified email
5. Validate token and expiration
6. Allow password change
7. Invalidate all existing sessions

**Example**:
```typescript
import crypto from 'crypto';

function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}
```

## Authentication

### Multi-Factor Authentication (MFA)

**Recommended Methods** (in order of preference):
1. FIDO2/WebAuthn (hardware keys)
2. TOTP (Time-based One-Time Password)
3. SMS (least secure, avoid if possible)

**Implementation**:
- Require MFA for sensitive operations
- Allow users to manage MFA devices
- Provide backup codes
- Support multiple MFA methods

### Session Management

**Session Tokens**:
- Use cryptographically random tokens
- Store securely (HttpOnly, Secure, SameSite cookies)
- Implement token rotation
- Set appropriate expiration times

**JWT Best Practices**:
```typescript
// Access token: short-lived (15 minutes)
const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
);

// Refresh token: longer-lived (7 days)
const refreshToken = jwt.sign(
    { userId, tokenVersion },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
);
```

**Cookie Configuration**:
```typescript
res.cookie('accessToken', token, {
    httpOnly: true,      // Prevent XSS
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 15 * 60 * 1000  // 15 minutes
});
```

### Rate Limiting

**Protect Against Brute Force**:
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later'
});

app.post('/api/login', loginLimiter, handleLogin);
```

## Input Validation

### Sanitization

**Always Validate and Sanitize**:
```typescript
import validator from 'validator';

function validateEmail(email: string): boolean {
    return validator.isEmail(email);
}

function sanitizeInput(input: string): string {
    return validator.escape(input);
}
```

### SQL Injection Prevention

**Use Parameterized Queries**:
```typescript
// ❌ BAD - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ GOOD - Parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

### XSS Prevention

**Escape Output**:
```typescript
// React automatically escapes by default
<div>{userInput}</div>  // Safe

// Be careful with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />  // Only if necessary
```

**Content Security Policy**:
```typescript
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
    next();
});
```

## HTTPS/TLS

### Requirements

- ✅ TLS 1.2 or higher
- ✅ Strong cipher suites
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ Certificate from trusted CA
- ❌ No mixed content (HTTP + HTTPS)

**HSTS Header**:
```typescript
app.use((req, res, next) => {
    res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );
    next();
});
```

## Dependency Management

### Vulnerability Scanning

**Automated Scanning**:
```bash
# Run on every commit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

**GitHub Dependabot**:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### Supply Chain Security

- ✅ Use package lock files
- ✅ Verify package signatures
- ✅ Review dependency changes
- ✅ Use private registry for internal packages
- ❌ Don't use packages with known vulnerabilities

## Secrets Management

### Never Commit Secrets

**Use Environment Variables**:
```typescript
// ✅ GOOD
const apiKey = process.env.API_KEY;

// ❌ BAD
const apiKey = 'sk_live_1234567890';
```

**Git Pre-commit Hook**:
```bash
#!/bin/sh
# Check for common secret patterns
git diff --cached --name-only | xargs grep -E "(API_KEY|SECRET|PASSWORD|PRIVATE_KEY)" && {
    echo "⚠️  Possible secret detected!"
    exit 1
}
```

### Secret Storage

**Use Secret Management Services**:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault

**For Development**:
```bash
# .env (add to .gitignore)
DATABASE_URL=postgresql://localhost/mydb
JWT_SECRET=your-secret-key
API_KEY=your-api-key
```

## API Security

### Authentication

- Use API keys or OAuth tokens
- Rotate keys regularly
- Implement rate limiting
- Log API usage

### CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Logging & Monitoring

### Security Logging

**Log Security Events**:
- Authentication attempts (success/failure)
- Authorization failures
- Input validation failures
- Rate limit violations
- Suspicious activity

**Example**:
```typescript
logger.security({
    event: 'login_failure',
    userId: email,
    ip: req.ip,
    timestamp: new Date(),
    reason: 'invalid_password'
});
```

### Log Sanitization

**Never Log Sensitive Data**:
- ❌ Passwords
- ❌ API keys
- ❌ Credit card numbers
- ❌ Personal identifiable information (PII)

## Security Checklist

### Pre-Deployment

- [ ] All dependencies updated
- [ ] No known vulnerabilities
- [ ] Secrets not committed
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Authentication properly implemented
- [ ] Authorization checks in place
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Error handling doesn't leak info
- [ ] Security testing completed

### Ongoing

- [ ] Weekly dependency updates
- [ ] Monthly security reviews
- [ ] Quarterly penetration testing
- [ ] Annual security audit
- [ ] Incident response plan updated
- [ ] Security training completed

## Compliance

### GDPR (if applicable)

- Right to access
- Right to deletion
- Data portability
- Privacy by design
- Data breach notification (72 hours)

### HIPAA (if applicable)

- Encryption at rest and in transit
- Access controls
- Audit logging
- Business associate agreements

## Resources

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [NIST SP 800-63B (Digital Identity Guidelines)](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Have I Been Pwned API](https://haveibeenpwned.com/API/v3)
