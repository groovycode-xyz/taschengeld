# Monitoring

This document outlines the monitoring and observability setup for Taschengeld.

## Overview

The monitoring system provides comprehensive visibility into system health, performance, and security.

## Monitoring Stack

### Core Components

- Prometheus - Metrics collection
- Grafana - Visualization
- ELK Stack - Log management
- AlertManager - Alert handling
- Node Exporter - System metrics

### Integration Points

```yaml
prometheus:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_configs:
    - job_name: 'node'
      static_configs:
        - targets: ['localhost:9100']
    - job_name: 'app'
      static_configs:
        - targets: ['app:3000']
```

## System Metrics

### Application Metrics

```typescript
interface AppMetrics {
  activeUsers: Gauge;
  requestLatency: Histogram;
  errorRate: Counter;
  taskCompletion: Counter;
  paymentProcessing: Histogram;
}
```

### Infrastructure Metrics

- CPU usage
- Memory utilization
- Disk I/O
- Network traffic
- Container stats

## Performance Monitoring

### Response Times

```typescript
interface LatencyMetrics {
  endpoint: string;
  method: string;
  p50: number; // milliseconds
  p90: number;
  p99: number;
}
```

### Resource Usage

```yaml
resource_alerts:
  cpu_high:
    threshold: 80%
    duration: 5m
  memory_high:
    threshold: 85%
    duration: 5m
  disk_space:
    threshold: 90%
    duration: 15m
```

## Log Management

### Log Sources

- Application logs
- System logs
- Access logs
- Error logs
- Audit logs

### Log Format

```json
{
  "timestamp": "2024-12-04T10:00:00Z",
  "level": "info",
  "service": "api",
  "trace_id": "abc123",
  "message": "Request processed",
  "metadata": {
    "user_id": 123,
    "endpoint": "/api/tasks",
    "method": "POST"
  }
}
```

## Alert Configuration

### Alert Rules

```yaml
groups:
  - name: app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected

      - alert: SlowResponses
        expr: http_request_duration_seconds{quantile="0.9"} > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: Slow response times detected
```

### Notification Channels

- Email notifications
- Slack alerts
- PagerDuty
- SMS alerts
- Webhook callbacks

## Dashboard Templates

### System Dashboard

```yaml
panels:
  - title: System Overview
    type: stat
    targets:
      - expr: system_cpu_usage
      - expr: system_memory_usage
      - expr: system_disk_usage

  - title: Application Health
    type: graph
    targets:
      - expr: rate(http_requests_total[5m])
      - expr: rate(http_errors_total[5m])
```

### Application Dashboard

```yaml
panels:
  - title: Active Users
    type: gauge
    targets:
      - expr: active_users_total

  - title: Task Completion
    type: graph
    targets:
      - expr: rate(tasks_completed_total[1h])
```

## Health Checks

### Endpoint Health

```typescript
interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  details: {
    database: boolean;
    cache: boolean;
    queue: boolean;
  };
}
```

### Component Health

- Database connectivity
- Cache availability
- Queue processing
- External services
- Storage access

## Performance Testing

### Load Testing

```bash
#!/bin/bash
# Load test script

# Run k6 test
k6 run \
  --vus 50 \
  --duration 30m \
  performance/load-test.js
```

### Stress Testing

```javascript
// k6 stress test
export default function () {
  const responses = http.batch([
    ['GET', 'http://app/api/tasks'],
    ['POST', 'http://app/api/tasks'],
    ['GET', 'http://app/api/users'],
  ]);
}
```

## Tracing

### Trace Configuration

```yaml
opentelemetry:
  service_name: tgeld
  sampler:
    type: always_on
  exporter:
    type: jaeger
    endpoint: http://jaeger:14268/api/traces
```

### Span Details

```typescript
interface TraceSpan {
  name: string;
  startTime: number;
  endTime: number;
  attributes: {
    'http.method': string;
    'http.url': string;
    'http.status_code': number;
  };
}
```

## Capacity Planning

### Resource Tracking

- CPU trends
- Memory growth
- Storage usage
- Network capacity
- User growth

### Scaling Triggers

```yaml
scaling_rules:
  cpu_scale:
    threshold: 75%
    duration: 5m
    action: scale_up
  memory_scale:
    threshold: 80%
    duration: 5m
    action: scale_up
```

## Security Monitoring

### Security Metrics

- Failed logins
- Permission changes
- API key usage
- Suspicious activity
- Data access

### Audit Logging

```typescript
interface AuditLog {
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure';
  metadata: Record<string, any>;
}
```

## Backup Monitoring

### Backup Metrics

- Backup success rate
- Backup duration
- Storage usage
- Restore tests
- Data integrity

### Backup Alerts

```yaml
backup_alerts:
  failed_backup:
    condition: backup_status != 'success'
    severity: critical
  backup_duration:
    condition: backup_duration > 4h
    severity: warning
```

## Best Practices

### Monitoring

1. Regular review
2. Alert tuning
3. Dashboard updates
4. Metric cleanup
5. Documentation

### Alerting

1. Clear severity levels
2. Actionable alerts
3. Proper routing
4. Escalation paths
5. Alert fatigue prevention

## Troubleshooting

### Common Issues

1. False positives
2. Missing data
3. Alert storms
4. Dashboard errors
5. Integration issues

### Solutions

1. Alert tuning
2. Data validation
3. Alert grouping
4. Dashboard fixes
5. Integration checks

## Additional Resources

1. [Backup Guide](backup-restore.md)
2. [Troubleshooting Guide](troubleshooting.md)
3. [Security Guidelines](../2-architecture/security.md)
4. [API Reference](../2-architecture/api-reference.md)

Last Updated: December 4, 2024
