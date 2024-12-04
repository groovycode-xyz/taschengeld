# Task Management

This document describes the task management features and functionality in Taschengeld.

## Overview

The task management system allows parents to create, assign, and manage tasks for their children. Children can view, complete, and receive rewards for tasks.

## Task Lifecycle

### 1. Task Creation
- Parents create tasks with title, description, and value
- Optional settings: due date, required proof, age restrictions
- Task templates for common activities

### 2. Task Assignment
- Assign to specific child or make available to all
- Set visibility and availability windows
- Define completion requirements

### 3. Task Completion
- Child marks task as complete
- Optional photo/proof upload
- Completion notes and timestamp

### 4. Task Verification
- Parent reviews completed task
- Approve or reject with feedback
- Automatic approval options

### 5. Reward Processing
- Automatic credit to child's balance
- Transaction record creation
- Optional bonus/penalty adjustments

## Task Types

### Regular Tasks
```typescript
interface RegularTask {
  title: string;
  description: string;
  value: number;        // in cents
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  dueDate?: Date;
}
```

### Special Tasks
```typescript
interface SpecialTask extends RegularTask {
  bonusValue?: number;  // additional reward
  requirements?: string[];
  proofRequired: boolean;
}
```

### Recurring Tasks
```typescript
interface RecurringTask extends RegularTask {
  recurrencePattern: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}
```

## Task States

1. **Draft**
   - Task created but not published
   - Editable by parent
   - Not visible to children

2. **Active**
   - Published and available
   - Visible to assigned children
   - Can be started/completed

3. **In Progress**
   - Child has started the task
   - Progress can be updated
   - Parent can monitor status

4. **Completed**
   - Child has marked as done
   - Awaiting parent verification
   - Proof/notes attached

5. **Verified**
   - Parent has approved completion
   - Reward processed
   - Added to history

6. **Rejected**
   - Parent has rejected completion
   - Feedback provided
   - Can be retried

7. **Expired**
   - Past due date
   - No longer completable
   - Archived status

## Task Management Interface

### Parent View
```typescript
interface ParentTaskView {
  createTask(task: TaskInput): Promise<Task>;
  editTask(taskId: number, updates: Partial<Task>): Promise<Task>;
  reviewTask(taskId: number, approved: boolean, feedback?: string): Promise<Task>;
  archiveTask(taskId: number): Promise<void>;
}
```

### Child View
```typescript
interface ChildTaskView {
  viewAvailableTasks(): Promise<Task[]>;
  startTask(taskId: number): Promise<Task>;
  updateProgress(taskId: number, progress: number): Promise<Task>;
  completeTask(taskId: number, proof?: TaskProof): Promise<Task>;
}
```

## Task Notifications

### Event Types
- Task created
- Task assigned
- Task started
- Task completed
- Task verified/rejected
- Task expired
- Reward processed

### Notification Methods
- In-app notifications
- Email notifications (optional)
- Push notifications (mobile)
- Daily/weekly summaries

## Task Analytics

### Parent Analytics
- Completion rates
- Average verification time
- Popular task types
- Value distribution
- Child performance

### Child Analytics
- Tasks completed
- Total earnings
- Completion streaks
- Category breakdown
- Progress trends

## Task Templates

### Household Chores
```json
{
  "title": "Clean Room",
  "description": "Make bed, pick up toys, vacuum floor",
  "value": 500,
  "frequency": "weekly",
  "estimatedDuration": "30m",
  "category": "cleaning"
}
```

### Academic Tasks
```json
{
  "title": "Complete Homework",
  "description": "Finish daily homework and show to parent",
  "value": 300,
  "frequency": "daily",
  "proofRequired": true,
  "category": "education"
}
```

## Integration Points

### API Endpoints
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `PUT /api/tasks/:id` - Update task
- `POST /api/tasks/:id/complete` - Complete task
- `POST /api/tasks/:id/verify` - Verify task

### Webhooks
- Task state changes
- Reward processing
- Bulk operations

### External Systems
- Calendar integration
- Reward systems
- Educational platforms

## Best Practices

### Task Creation
1. Clear, actionable titles
2. Detailed descriptions
3. Appropriate value assignment
4. Reasonable time frames
5. Age-appropriate tasks

### Task Management
1. Regular review schedule
2. Consistent verification
3. Constructive feedback
4. Fair reward distribution
5. Progress monitoring

## Troubleshooting

### Common Issues
1. Task not appearing for child
2. Completion proof not uploading
3. Reward not processing
4. Notification delays
5. State transition errors

### Solutions
1. Check assignment settings
2. Verify file size/format
3. Check balance/limits
4. Review notification settings
5. Check task conditions

## Additional Resources

1. [API Reference](../2-architecture/api-reference.md)
2. [User Management](user-management.md)
3. [Payment System](payment-system.md)
4. [Task API Documentation](../2-architecture/api.md)

Last Updated: December 4, 2024 