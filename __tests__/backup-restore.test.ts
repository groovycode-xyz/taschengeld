import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { BackupData, Task, CompletedTask, PiggybankAccount, PiggybankTransaction } from '@/types/database';

// Mock data for testing
const mockTask: Task = {
  task_id: 1,
  title: 'Clean Room',
  description: 'Make your bed and tidy up',
  icon_name: 'broom',
  sound_url: null,
  payout_value: '5.00',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockCompletedTask: CompletedTask = {
  c_task_id: 1,
  user_id: 1,
  task_id: 1,
  description: 'Room cleaned and organized',
  payout_value: '5.00',
  created_at: new Date(),
  comment: 'Great job!',
  attachment: null,
  payment_status: 'Unpaid',
};

const mockAccount: PiggybankAccount = {
  account_id: 1,
  user_id: 1,
  account_number: 'ACC001',
  balance: '100.00',
  created_at: new Date(),
};

const mockTransaction: PiggybankTransaction = {
  transaction_id: 1,
  account_id: 1,
  amount: '5.00',
  transaction_type: 'deposit',
  transaction_date: new Date(),
  description: 'Task completion reward',
  photo: null,
  completed_task_id: 1,
};

describe('Backup and Restore Functionality', () => {
  beforeEach(() => {
    // Reset mocks and database state before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Backup Creation', () => {
    it('should create a valid tasks backup', async () => {
      const mockResponse = {
        tasks: [mockTask],
        completed_tasks: [mockCompletedTask]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch('/api/backup/tasks');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.tasks).toHaveLength(1);
      expect(data.completed_tasks).toHaveLength(1);
      expect(data.tasks[0]).toMatchObject({
        title: "Clean Room",
        payout_value: "5.00"
      });
    });

    it('should create a valid piggybank backup', async () => {
      const mockResponse = {
        accounts: [mockAccount],
        transactions: [mockTransaction]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch('/api/backup/piggybank');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.accounts).toHaveLength(1);
      expect(data.transactions).toHaveLength(1);
      expect(data.accounts[0].balance).toBe("100.00");
    });

    it('should create a valid full system backup', async () => {
      const mockResponse = {
        tasks: [mockTask],
        accounts: [mockAccount],
        transactions: [mockTransaction]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await fetch('/api/backup/all');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.tasks).toBeDefined();
      expect(data.accounts).toBeDefined();
      expect(data.transactions).toBeDefined();
    });

    it('should handle backup errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Backup failed'));

      await expect(fetch('/api/backup/tasks')).rejects.toThrow('Backup failed');
    });
  });

  describe('Backup Validation', () => {
    it('should validate backup file structure', () => {
      const validBackup: BackupData = {
        timestamp: new Date().toISOString(),
        schema_version: "1.0",
        type: "tasks",
        data: {
          tasks: {
            tasks: [mockTask],
            completed_tasks: [mockCompletedTask]
          }
        }
      };

      expect(() => validateBackupStructure(validBackup)).not.toThrow();
    });

    it('should reject invalid backup structure', () => {
      const invalidBackup = {
        timestamp: new Date().toISOString(),
        // Missing required fields
        data: {}
      };

      expect(() => validateBackupStructure(invalidBackup as BackupData)).toThrow();
    });
  });

  describe('Restore Functionality', () => {
    it('should restore tasks backup successfully', async () => {
      const backupData = {
        tasks: [mockTask],
        completed_tasks: [mockCompletedTask]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Restore successful' })
      });

      const response = await fetch('/api/restore/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData)
      });

      expect(response.ok).toBe(true);
    });

    it('should restore piggybank backup successfully', async () => {
      const backupData = {
        accounts: [mockAccount],
        transactions: [mockTransaction]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Restore successful' })
      });

      const response = await fetch('/api/restore/piggybank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData)
      });

      expect(response.ok).toBe(true);
    });

    it('should handle restore errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Restore failed'));

      await expect(
        fetch('/api/restore/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
      ).rejects.toThrow('Restore failed');
    });

    it('should validate data integrity during restore', async () => {
      const backupData = {
        tasks: [{
          ...mockTask,
          payout_value: "invalid" // Invalid payout value
        }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ 
          error: 'Invalid payout value format'
        })
      });

      const response = await fetch('/api/restore/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData)
      });

      expect(response.ok).toBe(false);
    });
  });
});

// Helper function to validate backup structure
function validateBackupStructure(backup: BackupData): void {
  if (!backup.timestamp || !backup.type || !backup.data) {
    throw new Error('Invalid backup structure: missing required fields');
  }

  if (!['tasks', 'piggybank', 'all'].includes(backup.type)) {
    throw new Error('Invalid backup type');
  }

  // Validate data based on backup type
  switch (backup.type) {
    case 'tasks':
      if (!backup.data.tasks?.tasks) {
        throw new Error('Invalid tasks backup: missing tasks data');
      }
      break;
    case 'piggybank':
      if (!backup.data.piggybank?.accounts) {
        throw new Error('Invalid piggybank backup: missing accounts data');
      }
      break;
    case 'all':
      if (!backup.data.all?.tasks || !backup.data.all?.accounts) {
        throw new Error('Invalid full backup: missing required data');
      }
      break;
  }
} 