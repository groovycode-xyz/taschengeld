# API Architecture

This document describes the API architecture, endpoints, and integration patterns for Taschengeld.

## API Design Principles

- RESTful architecture
- JSON responses
- Versioned endpoints
- Consistent error handling
- Rate limiting
- Authentication required

## Base URL

```
Production: https://api.taschengeld.com/v1
Development: http://localhost:21971/api/v1
```

## Authentication

All API requests require authentication using JWT tokens:

```http
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with username and password
```json
{
  "username": "string",
  "password": "string"
}
```

#### POST /auth/refresh
Refresh JWT token
```json
{
  "refreshToken": "string"
}
```

### Users

#### GET /users
List users with pagination
```
Query Parameters:
- page (default: 1)
- perPage (default: 20)
- role (optional)
- status (optional)
```

#### POST /users
Create new user
```json
{
  "username": "string",
  "email": "string",
  "role": "enum(admin,parent,child)",
  "password": "string"
}
```

#### GET /users/:id
Get user details
```
Path Parameters:
- id: User ID
```

### Tasks

#### GET /tasks
List available tasks
```
Query Parameters:
- page
- perPage
- status
- category
```

#### POST /tasks
Create new task
```json
{
  "title": "string",
  "description": "string",
  "payoutValue": "number",
  "category": "string",
  "requiredAge": "number"
}
```

#### PUT /tasks/:id/complete
Mark task as completed
```json
{
  "completionNotes": "string",
  "attachments": ["string"]
}
```

### Piggybank

#### GET /piggybank/balance
Get current balance
```
Query Parameters:
- userId (optional)
```

#### POST /piggybank/transfer
Transfer funds
```json
{
  "fromUserId": "number",
  "toUserId": "number",
  "amount": "number",
  "notes": "string"
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user
- Custom limits for specific endpoints

## Caching

### Cache Headers
```http
Cache-Control: private, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### Cached Endpoints
- GET /tasks
- GET /users
- GET /piggybank/balance

## Versioning

### Version Format
```
/v{major_version}/
Example: /v1/users
```

### Version Lifecycle
1. Current: v1
2. Beta: v2-beta
3. Deprecated: none

## Error Codes

### Common Errors
- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `PERMISSION_DENIED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Invalid input data

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Webhooks

### Available Events
- `user.created`
- `task.completed`
- `payment.processed`

### Webhook Format
```json
{
  "event": "string",
  "timestamp": "ISO8601",
  "data": {}
}
```

## API Clients

### Official SDKs
- JavaScript/TypeScript
- Python
- Mobile (iOS/Android)

### Example Usage (TypeScript)
```typescript
import { TaschengeldClient } from '@taschengeld/sdk';

const client = new TaschengeldClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

const tasks = await client.tasks.list({
  page: 1,
  perPage: 20
});
```

## Integration Patterns

### Recommended Practices
1. Implement exponential backoff
2. Handle rate limiting
3. Validate responses
4. Monitor API health
5. Cache responses

### Security Considerations
1. Store API keys securely
2. Use HTTPS only
3. Validate webhook signatures
4. Implement request timeouts
5. Handle errors gracefully

## Monitoring

### Metrics Tracked
- Request volume
- Response times
- Error rates
- Cache hit rates
- API usage by endpoint

### Health Checks
- GET /health
- GET /health/db
- GET /health/cache

## Additional Resources

1. [API Reference](../3-development/api-reference.md)
2. [Integration Guide](../3-development/integration.md)
3. [SDK Documentation](../3-development/sdk.md)
4. [Webhook Guide](../3-development/webhooks.md)

Last Updated: December 4, 2024 