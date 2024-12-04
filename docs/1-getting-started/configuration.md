# Configuration Guide

This guide covers all configuration options for the Taschengeld application.

## Environment Variables

### Core Settings

```env
# Node Environment
NODE_ENV=development|production|test

# Application
PORT=21971
HOST=0.0.0.0
NEXT_PUBLIC_API_URL=http://localhost:21971

# Database
DB_HOST=tgeld-db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=tgeld
DB_SSL=false

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRY=24h
```

### Optional Features

```env
# File Upload
ENABLE_FILE_UPLOAD=true
MAX_UPLOAD_SIZE=5242880
UPLOAD_DIR=/app/uploads

# Logging
LOG_LEVEL=info|debug|error
LOG_FORMAT=json|text

# Performance
CACHE_ENABLED=true
CACHE_TTL=3600
```

## Configuration Files

### Development
`.env.local`:
- Used for local development
- Not committed to version control
- Overrides default settings

### Production
`.env`:
- Production settings
- Committed to version control
- Contains default values

### Testing
`.env.test`:
- Used during test runs
- Specific test database
- Mock external services

## Database Configuration

### Connection Pool
```env
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_IDLE_TIMEOUT=10000
```

### SSL Options
```env
DB_SSL=true
DB_SSL_CA=/path/to/ca.crt
DB_SSL_KEY=/path/to/client-key.pem
DB_SSL_CERT=/path/to/client-cert.pem
```

## Security Settings

### Authentication
```env
# JWT Configuration
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Password Policy
MIN_PASSWORD_LENGTH=8
REQUIRE_SPECIAL_CHARS=true
PASSWORD_EXPIRY_DAYS=90
```

### API Security
```env
# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_METHODS=GET,POST,PUT,DELETE
```

## File Upload Configuration

### Basic Settings
```env
ENABLE_FILE_UPLOAD=true
MAX_UPLOAD_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

### Storage Options
```env
# Local Storage
UPLOAD_DIR=/app/uploads
TEMP_DIR=/app/temp

# S3 Storage (if implemented)
S3_BUCKET=your-bucket
S3_REGION=eu-central-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

## Logging Configuration

### Log Settings
```env
# Logging Level
LOG_LEVEL=info

# Log Format
LOG_FORMAT=json

# Log Destination
LOG_OUTPUT=file|console|both
LOG_FILE=/app/logs/app.log
```

### Error Tracking
```env
# Error Reporting
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
```

## Performance Tuning

### Caching
```env
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_MAX_SIZE=1000
```

### Database Performance
```env
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_STATEMENT_TIMEOUT=30000
```

## Development Tools

### Debug Settings
```env
DEBUG=app:*
DEBUG_COLORS=true
DEBUG_HIDE_DATE=false
```

### Hot Reload
```env
WATCH_ENABLED=true
WATCH_IGNORE=node_modules,*.test.ts
```

## Configuration Hierarchy

The application loads configuration in this order:
1. Default values
2. Environment-specific file (`.env.local`, `.env.test`)
3. System environment variables
4. Command line arguments

## Validation

The application validates configuration on startup:
1. Required variables
2. Value formats
3. Dependency checks
4. Security requirements

## Best Practices

1. **Security**
   - Never commit sensitive values
   - Use strong secrets
   - Rotate credentials regularly

2. **Development**
   - Use `.env.local` for local settings
   - Document new variables
   - Keep test configuration separate

3. **Production**
   - Use environment variables
   - Implement secret management
   - Monitor configuration changes

## Troubleshooting

### Common Issues

1. **Missing Variables**
   - Error: `Required environment variable X is not set`
   - Solution: Check `.env` file and environment

2. **Invalid Values**
   - Error: `Invalid value for X`
   - Solution: Review variable format requirements

3. **Connection Issues**
   - Error: `Could not connect to database`
   - Solution: Verify database configuration

## Configuration Management

### Version Control
- Keep `.env.example` updated
- Document changes in CHANGELOG
- Review in pull requests

### Deployment
- Use deployment platform features
- Implement secret management
- Validate before deploy

## Next Steps

1. [Deployment Guide](deployment.md)
2. [Security Guide](../2-architecture/security.md)
3. [Monitoring Guide](../5-maintenance/monitoring.md)

Last Updated: December 4, 2024 